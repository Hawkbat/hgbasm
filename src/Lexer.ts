import Compiler from './Compiler'
import Diagnostic from './Diagnostic'
import ILexerOptions from './ILexerOptions'
import LexerContext from './LexerContext'
import LineContext from './LineContext'
import Token from './Token'
import TokenType from './TokenType'

interface ILexerRule {
    type: TokenType
    match: RegExp
    allowIn?: TokenType
}

const regexpCache: { [key: string]: RegExp } = {}

function getCachedRegExp(key: string, flags: string = 'g'): RegExp {
    if (!regexpCache[key]) {
        regexpCache[key] = new RegExp(key, flags)
    }
    regexpCache[key].lastIndex = 0
    return regexpCache[key]
}

export default class Lexer {

    public rules: ILexerRule[] = [
        {
            type: TokenType.comment,
            match: /(?<!")(;.*|^\*.*)/g
        },
        {
            type: TokenType.string,
            match: /((?:")(?:(?:\\{2})*|(?:.*?[^\\](?:\\{2})*))(?:"))/g
        },
        {
            type: TokenType.escape,
            match: /(\\[\\",{}nt123456789@])/g,
            allowIn: TokenType.string
        },
        {
            type: TokenType.macro_escape,
            match: /(\\[123456789@])/g
        },
        {
            type: TokenType.interp,
            match: /({[a-zA-Z0-9_#@]+\})/g,
            allowIn: TokenType.string
        },
        {
            type: TokenType.space,
            match: /([ \t]+)/g
        },
        {
            type: TokenType.hex_number,
            match: /(\$[0-9a-fA-F]+)/g
        },
        {
            type: TokenType.keyword,
            match: /(?<!\.)\b(include|incbin|export|global|union|nextu|endu|printt|printv|printi|printf|fail|warn|if|elif|else|endc|purge|rept|endr|opt|popo|pusho|pops|pushs|equ|set|equs|macro|endm|shift|charmap|rsreset|rsset|rb|rw|rl|db|dw|dl|ds|section|align)\b/gi
        },
        {
            type: TokenType.region,
            match: /(?<!\.)\b(rom0|romx|vram|sram|wram0|wramx|oam|hram)\b/gi
        },
        {
            type: TokenType.function,
            match: /(?<!\.)\b(mul|sin|cos|tan|asin|acos|atan|atan2|strcat|strcmp|strin|strlen|strlwr|strsub|strupr|bank|def|high|low)\b/gi
        },
        {
            type: TokenType.opcode,
            match: /(?<!^|\.)\b(adc|add|and|bit|call|ccf|cp|cpl|daa|dec|di|ei|halt|inc|jp|jr|ld|ldh|ldi|ldd|ldhl|nop|or|pop|push|res|ret|reti|rl|rla|rlc|rlca|rr|rra|rrc|rrca|rst|sbc|scf|sla|sra|srl|stop|sub|swap|xor)\b/gi
        },
        {
            type: TokenType.register,
            match: /(?<!\.)(\b(?:hl[+-])|\b(?:a|f|b|c|d|e|h|l|af|bc|de|hl|hli|hld|sp|pc)\b(?!#))/gi
        },
        {
            type: TokenType.condition,
            match: /(?<!\.)\b(z|nz|c|nc)\b(?!#)/gi
        },
        {
            type: TokenType.label,
            match: /^((?:[a-zA-Z_@][a-zA-Z_0-9#@]*)?\.?[a-zA-Z_@][a-zA-Z_0-9#@]*:?:?)/g
        },
        {
            type: TokenType.identifier,
            match: /((?:[a-zA-Z_@][a-zA-Z_0-9#@]*)?\.?[a-zA-Z_@][a-zA-Z_0-9#@]*)/g
        },
        {
            type: TokenType.fixed_point_number,
            match: /([0-9]+\.[0-9]+)/g
        },
        {
            type: TokenType.binary_number,
            match: /(%[0-1]+)/g
        },
        {
            type: TokenType.octal_number,
            match: /(&[0-7]+)/g
        },
        {
            type: TokenType.gbgfx_number,
            match: /(`[0-3]+)/g
        },
        {
            type: TokenType.decimal_number,
            match: /([0-9]+)/g
        },
        {
            type: TokenType.operator,
            match: /(!=|==|<=|>=|&&|\|\||<<|>>|<|>|~|\+|-|\*|\/|%|&|\||\^|=|!)/g
        },
        {
            type: TokenType.comma,
            match: /(,)/g
        },
        {
            type: TokenType.colon,
            match: /(:)/g
        },
        {
            type: TokenType.open_bracket,
            match: /(\[)/g
        },
        {
            type: TokenType.close_bracket,
            match: /(\])/g
        },
        {
            type: TokenType.open_paren,
            match: /(\()/g
        },
        {
            type: TokenType.close_paren,
            match: /(\))/g
        },
        {
            type: TokenType.unknown,
            match: /(.)/g
        }
    ]

    constructor(public compiler: Compiler) {

    }

    public lex(line: LineContext, options: ILexerOptions): LexerContext {
        const ctx = new LexerContext(options, line)

        let text = line.source.text

        text = this.applyAllReplacements(text, ctx)

        line.text = text

        if (line.text !== line.source.text) {
            this.compiler.logger.log('stringExpansion', 'Before:', line.source.text)
            this.compiler.logger.log('stringExpansion', 'After: ', line.text)
        }

        const tokens = this.lexString(text, line.getLineNumber())

        ctx.tokens = tokens.map((token) => token.clone())

        line.lex = ctx

        return ctx
    }

    public applyAllReplacements(text: string, ctx: LexerContext): string {
        if (ctx.line.eval && ctx.line.eval.state) {
            let anyReplaced = true
            while (anyReplaced) {
                anyReplaced = false
                if (ctx.line.eval.state.stringEquates && !getCachedRegExp('\\bpurge\\b', 'i').test(text) && !getCachedRegExp('\\bdef\\b', 'i').test(text)) {
                    for (const key of Object.keys(ctx.line.eval.state.stringEquates)) {
                        if (text.indexOf(key) === -1) {
                            continue
                        }
                        const value = ctx.line.eval.state.stringEquates[key]
                        const regex = getCachedRegExp(`(?<!\\.)\\{?\\b${key}\\b\\}?`)
                        const newText = this.applyTextReplace(text, regex, value)
                        if (text !== newText) {
                            text = newText
                            anyReplaced = true
                        }
                    }
                }
                if (ctx.line.eval.state.inMacroCalls && ctx.line.eval.state.inMacroCalls.length) {
                    const macroCall = ctx.line.eval.state.inMacroCalls[0]
                    for (let key = 1; key < 10; key++) {
                        if (text.indexOf(`\\${key}`) === -1) {
                            continue
                        }
                        const offset = key - 1 + macroCall.argOffset
                        const value = macroCall.args[offset] ? macroCall.args[offset] : ''
                        const regex = getCachedRegExp(`\\\\${key}`)
                        const newText = this.applyTextReplace(text, regex, value)
                        if (text !== newText) {
                            text = newText
                            anyReplaced = true
                        }
                    }
                }
                if (ctx.line.eval.state.macroCounter !== undefined) {
                    if (text.indexOf('\\@') >= 0) {
                        const value = `_${ctx.line.eval.state.macroCounter}`
                        const regex = getCachedRegExp(`\\\\@`)
                        const newText = this.applyTextReplace(text, regex, value)
                        if (text !== newText) {
                            text = newText
                            anyReplaced = true
                        }
                    }
                }
            }
        }
        return text
    }

    public lexString(text: string, lineNumber: number): Token[] {
        const tokens: Token[] = []
        tokens.push(new Token(TokenType.start_of_line, '', lineNumber, 0))

        for (const rule of this.rules) {
            rule.match.lastIndex = 0
            let matches = rule.match.exec(text)
            while (matches !== null) {
                const t = new Token(rule.type, matches[1], lineNumber, matches.index)

                const inString = ((text.substr(0, t.col).match(/(?<!(?<!\\)\\)"/g) || []).length % 2) !== 0

                if (!inString || t.type === TokenType.string || rule.allowIn === TokenType.string) {
                    const overlaps = tokens.filter((o) => o.col <= t.col && o.value.length + o.col >= t.value.length + t.col)
                    if (overlaps.length === 0) {
                        tokens.push(t)
                    } else if (rule.allowIn) {
                        for (const o of overlaps) {
                            if (o.type === rule.allowIn) {
                                tokens.push(t)
                                break
                            }
                        }
                    }
                }
                matches = rule.match.exec(text)
            }
        }

        tokens.push(new Token(TokenType.end_of_line, '\n', lineNumber, text.length))

        tokens.sort((a, b) => {
            if (a.line !== b.line) { return a.line - b.line }
            if (a.col !== b.col) { return a.col - b.col }
            return a.type - b.type
        })

        return tokens
    }

    public applyTextReplace(text: string, regex: RegExp, value: string): string {
        let inString = this.getInStringArray(text)
        let matches = regex.exec(text)
        while (matches !== null) {
            if (!inString[matches.index]) {
                const dstIndex = matches.index
                const dstLength = value.length
                const srcLength = matches[0].length

                text = text.substring(0, dstIndex) + value + text.substring(dstIndex + srcLength)
                inString = this.getInStringArray(text)

                regex.lastIndex = dstIndex + dstLength
            }
            matches = regex.exec(text)
        }
        return text
    }

    public getInStringArray(source: string): boolean[] {
        const inString: boolean[] = []
        let currentInString = false
        let escaping = false
        for (const c of source) {
            if (c === '\\') {
                escaping = !escaping
            } else if (c === '"') {
                if (escaping) {
                    escaping = false
                } else {
                    currentInString = !currentInString
                }
            } else {
                escaping = false
            }
            inString.push(currentInString)
        }
        return inString
    }

    public error(msg: string, token: Token | undefined, ctx: LexerContext): void {
        ctx.line.file.context.diagnostics.push(new Diagnostic('Lexer', msg, 'error', token, ctx.line))
    }
}
