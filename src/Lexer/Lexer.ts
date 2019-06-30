import Diagnostic from '../Diagnostic'
import Logger from '../Logger'
import Token from '../Token'
import TokenType from '../TokenType'
import ITokenRule from './ITokenRule'
import LexerContext from './LexerContext'
import LexerRule from './LexerRule'
import MatchType from './MatchType'
import TokenNestingRules from './TokenNestingRules'
import TokenReplacementRules from './TokenReplacementRules'
import TokenRules from './TokenRules'

export default class Lexer {
    public logger: Logger

    constructor(logger: Logger) {
        this.logger = logger
    }

    public lex(ctx: LexerContext): LexerContext {

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
            this.logger.logLine('stringExpansion', 'Before:', ctx.line.source.text)
            this.logger.logLine('stringExpansion', 'After: ', ctx.line.text)
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
            TokenRules.filter((r) => !r.onlyAsSubToken) :
            TokenRules.filter((r) => TokenNestingRules[r.type] && TokenNestingRules[r.type].includes(inType))

        for (const rule of validRules) {
            const result = this.lexTokenRule(index, rule, ctx)
            if (result && (!match || result.value.length > match.value.length)) {
                match = result
            }
        }

        if (!match && !inType) {
            match = new Token(TokenType.unknown, ctx.line.text.substr(index, 1), ctx.line.lineNumber, index)
        }
        if (match && TokenReplacementRules[match.type]) {
            TokenReplacementRules[match.type](match, inType, ctx, this)
        }
        return match
    }

    public lexTokenRule(index: number, rule: ITokenRule, ctx: LexerContext): Token | undefined {
        let len = 0
        if (rule.startOfLine !== undefined && rule.startOfLine !== (index === 0)) {
            return undefined
        }
        if (rule.start) {
            const result = this.lexRule(index + len, rule.start, ctx)
            if (result === undefined) {
                return undefined
            }
            len += result
        }
        if (rule.rules) {
            for (const subRule of rule.rules) {
                const result = this.lexRule(index + len, subRule, ctx)
                if (result === undefined) {
                    return undefined
                }
                len += result
            }
            if (rule.end) {
                const result = this.lexRule(index + len, rule.end, ctx)
                if (result === undefined) {
                    return undefined
                }
                if (!rule.endLookahead) {
                    len += result
                }
            }
        } else {
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
        const line = ctx.line.text.toLowerCase()
        while (count < max) {
            const match = patterns.find((p) => line.substr(index + len, p.length) === p)
            if (match) {
                count++
                len += match.length
            } else {
                break
            }
        }
        return count >= min ? len : undefined
    }

    public substituteToken(token: Token, value: string, ctx: LexerContext): void {
        ctx.line.text = ctx.line.text.substring(0, token.col) + value + ctx.line.text.substring(token.col + token.value.length)
        token.type = TokenType.replaced
        this.logger.logLine('stringExpansion', 'Substituting', token.value, 'for', value)
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
