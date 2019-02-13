import Diagnostic from '../Diagnostic'
import Logger from '../Logger'
import LexerContext from './LexerContext'
import Token from './Token'
import TokenType from './TokenType'

type LexerRule = [MatchType, string[]]
type NestingRule = TokenType[]
type ReplacementRule = (token: Token, inType: TokenType | undefined, ctx: LexerContext) => void

enum MatchType {
    zero,
    zeroOrOne,
    zeroOrMore,
    one,
    oneOrMore
}

interface ILexerTokenRule {
    type: TokenType
    start?: LexerRule
    end?: LexerRule
    endLookahead?: boolean
    rules?: LexerRule[]
    startOfLine?: boolean
    onlyAsSubToken?: boolean
}

export default class Lexer {
    public logger: Logger

    public tokenRules: ILexerTokenRule[] = [
        {
            type: TokenType.semicolon_comment,
            start: [MatchType.one, [';']]
        },
        {
            type: TokenType.asterisk_comment,
            start: [MatchType.one, ['*']],
            startOfLine: true
        },
        {
            type: TokenType.string,
            start: [MatchType.one, ['"']],
            end: [MatchType.one, ['"']]
        },
        {
            type: TokenType.string_escape,
            rules: [[MatchType.one, ['\\\\', '\\"', '\\,', '\\{', '\\}', '\\n', '\\t']]],
            onlyAsSubToken: true
        },
        {
            type: TokenType.macro_escape,
            rules: [[MatchType.one, ['\\1', '\\2', '\\3', '\\4', '\\5', '\\6', '\\7', '\\8', '\\9', '\\@']]]
        },
        {
            type: TokenType.string_interpolation,
            rules: [
                [MatchType.one, ['{']],
                [MatchType.zeroOrMore, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_', '#', '@']],
                [MatchType.one, ['}']]
            ],
            onlyAsSubToken: true
        },
        {
            type: TokenType.macro_argument,
            end: [MatchType.one, [',', ';']],
            endLookahead: true,
            onlyAsSubToken: true
        },
        {
            type: TokenType.space,
            rules: [[MatchType.oneOrMore, [' ', '\t']]]
        },
        {
            type: TokenType.hex_number,
            rules: [
                [MatchType.one, ['$']],
                [MatchType.oneOrMore, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']]
            ]
        },
        {
            type: TokenType.keyword,
            rules: [[MatchType.one, ['include', 'incbin', 'export', 'global', 'union', 'nextu', 'endu', 'printt', 'printv', 'printi', 'printf', 'fail', 'warn', 'if', 'elif', 'else', 'endc', 'purge', 'rept', 'endr', 'opt', 'popo', 'pusho', 'pops', 'pushs', 'equ', 'set', 'equs', 'macro', 'endm', 'shift', 'charmap', 'rsreset', 'rsset', 'rb', 'rw', 'rl', 'db', 'dw', 'dl', 'ds', 'section', 'align']]]
        },
        {
            type: TokenType.region,
            rules: [[MatchType.one, ['rom0', 'romx', 'vram', 'sram', 'wram0', 'wramx', 'oam', 'hram']]]
        },
        {
            type: TokenType.function,
            rules: [[MatchType.one, ['mul', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2', 'strcat', 'strcmp', 'strin', 'strlen', 'strlwr', 'strsub', 'strupr', 'bank', 'def', 'high', 'low']]]
        },
        {
            type: TokenType.opcode,
            rules: [[MatchType.one, ['adc', 'add', 'and', 'bit', 'call', 'ccf', 'cp', 'cpl', 'daa', 'dec', 'di', 'ei', 'halt', 'inc', 'jp', 'jr', 'ld', 'ldh', 'ldi', 'ldd', 'ldhl', 'nop', 'or', 'pop', 'push', 'res', 'ret', 'reti', 'rl', 'rla', 'rlc', 'rlca', 'rr', 'rra', 'rrc', 'rrca', 'rst', 'sbc', 'scf', 'sla', 'sra', 'srl', 'stop', 'sub', 'swap', 'xor']]]
        },
        {
            type: TokenType.register,
            rules: [[MatchType.one, ['a', 'f', 'b', 'c', 'd', 'e', 'h', 'l', 'af', 'bc', 'de', 'hl', 'hli', 'hld', 'hl+', 'hl-', 'sp', 'pc']]]
        },
        {
            type: TokenType.condition,
            rules: [[MatchType.one, ['z', 'nz', 'c', 'nc']]]
        },
        {
            type: TokenType.identifier,
            rules: [
                [MatchType.one, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '.', '_', '@', '#']],
                [MatchType.zeroOrMore, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '_', '@', '#']],
                [MatchType.zeroOrMore, [':']]
            ]
        },
        {
            type: TokenType.fixed_point_number,
            rules: [
                [MatchType.oneOrMore, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']],
                [MatchType.one, ['.']],
                [MatchType.oneOrMore, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']]
            ]
        },
        {
            type: TokenType.binary_number,
            rules: [
                [MatchType.one, ['%']],
                [MatchType.oneOrMore, ['0', '1']]
            ]
        },
        {
            type: TokenType.octal_number,
            rules: [
                [MatchType.one, ['&']],
                [MatchType.oneOrMore, ['0', '1', '2', '3', '4', '5', '6', '7']]
            ]
        },
        {
            type: TokenType.gbgfx_number,
            rules: [
                [MatchType.one, ['`']],
                [MatchType.oneOrMore, ['0', '1', '2', '3']]
            ]
        },
        {
            type: TokenType.decimal_number,
            rules: [[MatchType.oneOrMore, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']]]
        },
        {
            type: TokenType.operator,
            rules: [[MatchType.one, ['!=', '==', '<=', '>=', '&&', '||', '<<', '>>', '<', '>', '~', '+', '-', '*', '/', '%', '&', '|', '^', '=', '!']]]
        },
        {
            type: TokenType.comma,
            rules: [[MatchType.one, [',']]]
        },
        {
            type: TokenType.colon,
            rules: [[MatchType.one, [':']]]
        },
        {
            type: TokenType.open_bracket,
            rules: [[MatchType.one, ['[']]]
        },
        {
            type: TokenType.close_bracket,
            rules: [[MatchType.one, [']']]]
        },
        {
            type: TokenType.open_paren,
            rules: [[MatchType.one, ['(']]]
        },
        {
            type: TokenType.close_paren,
            rules: [[MatchType.one, [')']]]
        }
    ]

    public nestingRules: { [key: number]: NestingRule } = {
        [TokenType.string_escape]: [TokenType.string, TokenType.macro_argument],
        [TokenType.string_interpolation]: [TokenType.string, TokenType.macro_argument],
        [TokenType.macro_escape]: [TokenType.string, TokenType.macro_argument],
        [TokenType.semicolon_comment]: [TokenType.macro_call],
        [TokenType.comma]: [TokenType.macro_call],
        [TokenType.macro_argument]: [TokenType.macro_call]
    }

    public replacementRules: { [key: number]: ReplacementRule } = {
        [TokenType.identifier]: (token, inType, ctx) => {
            if (ctx.state.inMacroDefines && ctx.state.inMacroDefines.length) {
                return
            }
            if (inType === undefined) {
                let value = token.value
                while (value.endsWith(':')) {
                    value = value.substr(0, value.length - 1)
                }

                const isStringEquate =
                    ctx.state.stringEquates &&
                    ctx.state.stringEquates[value] &&
                    !ctx.tokens.some((t) =>
                        (t.type === TokenType.keyword && t.value.toLowerCase() === 'purge') ||
                        (t.type === TokenType.function && t.value.toLowerCase() === 'def'))

                const isMacroCall =
                    token.col > 0 &&
                    !ctx.tokens.some((t) =>
                        t.type === TokenType.keyword ||
                        t.type === TokenType.opcode ||
                        t.type === TokenType.operator)

                if (isStringEquate && ctx.state.stringEquates) {
                    this.substituteToken(token, ctx.state.stringEquates[value].value, ctx)
                } else if (isMacroCall) {
                    token.type = TokenType.macro_call
                    ctx.inType = TokenType.macro_call
                }
            }
        },
        [TokenType.macro_escape]: (token, inType, ctx) => {
            if (ctx.state.inMacroDefines && ctx.state.inMacroDefines.length) {
                return
            }
            if (inType === undefined) {
                if (ctx.state.inMacroCalls && ctx.state.inMacroCalls.length) {
                    if (token.value === '\\@') {
                        token.value = `_${ctx.state.macroCounter}`
                    } else {
                        const macroCall = ctx.state.inMacroCalls[0]
                        const index = parseInt(token.value.substr(1), 10) + macroCall.argOffset
                        if (index <= macroCall.args.length) {
                            this.substituteToken(token, macroCall.args[index - 1], ctx)
                        } else {
                            this.error('Macro argument was not provided when macro was called', token, ctx)
                        }
                    }
                } else {
                    this.error('Macro arguments can only be accessed within macro calls', token, ctx)
                }
            }
        }
    }

    constructor(logger: Logger) {
        this.logger = logger
    }

    public async lex(ctx: LexerContext): Promise<LexerContext> {

        ctx.line.text = ctx.line.source.text

        ctx.tokens = []

        ctx.tokens.push(new Token(TokenType.start_of_line, '', ctx.line.lineNumber, 0))

        let index = 0
        while (index < ctx.line.text.length) {
            const token = this.lexToken(index, ctx.inType, ctx)
            if (!token) {
                index++
            } else if (token.type !== TokenType.replaced) {
                ctx.tokens.push(token)
                index = token.col + token.value.length
            } else {
                ctx.tokens.length = 1
                index = 0
            }
        }

        ctx.tokens.push(new Token(TokenType.end_of_line, '\n', ctx.line.lineNumber, ctx.line.text.length))

        ctx.tokens.sort((a, b) => {
            if (a.line !== b.line) { return a.line - b.line }
            if (a.col !== b.col) { return a.col - b.col }
            return a.type - b.type
        })

        if (ctx.line.text !== ctx.line.source.text) {
            this.logger.log('stringExpansion', 'Before:', ctx.line.source.text, '\n')
            this.logger.log('stringExpansion', 'After: ', ctx.line.text, '\n')
        }

        ctx.tokens = ctx.tokens.map((token) => token.clone())

        ctx.line.lex = ctx

        return ctx
    }

    public lexToken(index: number, inType: TokenType | undefined, ctx: LexerContext): Token | undefined {
        let match: Token | undefined

        if (index >= ctx.line.text.length) {
            return undefined
        }

        const validRules = inType === undefined ?
            this.tokenRules.filter((r) => !r.onlyAsSubToken) :
            this.tokenRules.filter((r) => this.nestingRules[r.type] && this.nestingRules[r.type].includes(inType))

        for (const rule of validRules) {
            const result = this.lexTokenRule(index, rule, ctx)
            if (result && (!match || result.value.length > match.value.length)) {
                match = result
            }
        }

        if (!match && !inType) {
            match = new Token(TokenType.unknown, ctx.line.text.substr(index, 1), ctx.line.lineNumber, index)
        }
        if (match && this.replacementRules[match.type]) {
            this.replacementRules[match.type](match, inType, ctx)
        }
        return match
    }

    public lexTokenRule(index: number, rule: ILexerTokenRule, ctx: LexerContext): Token | undefined {
        let len = 0
        if (rule.startOfLine !== undefined && rule.startOfLine !== (index === 0)) {
            return undefined
        }
        if (rule.rules) {
            for (const subRule of rule.rules) {
                const result = this.lexRule(index + len, subRule, ctx)
                if (result === undefined) {
                    return undefined
                }
                len += result
            }
        } else {
            if (rule.start) {
                const result = this.lexRule(index + len, rule.start, ctx)
                if (result === undefined) {
                    return undefined
                }
                len += result
            }
            while (index + len < ctx.line.text.length) {
                if (rule.end) {
                    const result = this.lexRule(index + len, rule.end, ctx)
                    if (result !== undefined) {
                        if (!rule.endLookahead) {
                            len += result
                        }
                        break
                    }
                }
                const t = this.lexToken(index + len, rule.type, ctx)
                if (t) {
                    len += (t.col + t.value.length) - (index + len)
                } else {
                    len++
                }
            }
        }
        return new Token(rule.type, ctx.line.text.substr(index, len), ctx.line.lineNumber, index)
    }

    public lexRule(index: number, rule: LexerRule, ctx: LexerContext): number | undefined {
        const countType = rule[0]
        const patterns = rule[1]
        let min = 0
        let max = 0
        switch (countType) {
            case MatchType.zero:
                break
            case MatchType.zeroOrOne:
                max = 1
                break
            case MatchType.zeroOrMore:
                max = Infinity
                break
            case MatchType.one:
                min = 1
                max = 1
                break
            case MatchType.oneOrMore:
                min = 1
                max = Infinity
                break
        }
        let len = 0
        let count = 0
        while (count < max) {
            let nextLen = 0
            let matched = false
            for (const pattern of patterns) {
                if (ctx.line.text.toLowerCase().substr(index + len, pattern.length) === pattern) {
                    nextLen = Math.max(nextLen, pattern.length)
                    matched = true
                }
            }
            if (!matched) {
                break
            }
            count++
            len += nextLen
        }
        return count >= min ? len : undefined
    }

    public substituteToken(token: Token, value: string, ctx: LexerContext): void {
        ctx.line.text = ctx.line.text.substring(0, token.col) + value + ctx.line.text.substring(token.col + token.value.length)
        token.type = TokenType.replaced
        this.logger.log('stringExpansion', 'Substituting', token.value, 'for', value, '\n')
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
        ctx.diagnostics.push(new Diagnostic('Lexer', msg, 'error', token, ctx.line))
    }
}
