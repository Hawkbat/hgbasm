import Diagnostic from '../Diagnostic'
import Logger from '../Logger'
import Node from '../Node'
import NodeType from '../NodeType'
import Token from '../Token'
import TokenType from '../TokenType'
import InfixNodeRules from './InfixNodeRules'
import InfixPrecedenceRules from './InfixPrecedenceRules'
import ParserContext from './ParserContext'
import PrefixNodeRules from './PrefixNodeRules'
import PrefixPrecedenceRules from './PrefixPrecedenceRules'

export default class Parser {
    public logger: Logger

    constructor(logger: Logger) {
        this.logger = logger
    }

    public parse(ctx: ParserContext): ParserContext {
        if (ctx.line.lex) {
            const checkMacro =
                ctx.state.inMacroDefines &&
                ctx.state.inMacroDefines.length &&
                !ctx.line.lex.tokens.some((t) =>
                    t.type === TokenType.keyword &&
                    (t.value.toLowerCase() === 'macro' ||
                        t.value.toLowerCase() === 'endm'))
            const checkConditional =
                ctx.state.inConditionals &&
                ctx.state.inConditionals.length &&
                !ctx.state.inConditionals.every((cond) => cond.condition) &&
                !(ctx.line.lex.tokens &&
                    ctx.line.lex.tokens.some((t) =>
                        t.value.toLowerCase() === 'if' ||
                        t.value.toLowerCase() === 'elif' ||
                        t.value.toLowerCase() === 'else' ||
                        t.value.toLowerCase() === 'endc'))
            if (checkMacro || checkConditional) {
                ctx.node = new Node(NodeType.comment, new Token(TokenType.semicolon_comment, ctx.line.text, 0, 0), [])
                ctx.line.parse = ctx
                return ctx
            }

            ctx.tokens = ctx.line.lex.tokens.filter((t) =>
                t.type !== TokenType.space &&
                t.type !== TokenType.string_escape &&
                t.type !== TokenType.macro_escape &&
                t.type !== TokenType.string_interpolation).reverse()
            ctx.node = this.parseNode(0, ctx)
        } else {
            this.error('Line was parsed before lexing, aborting', undefined, ctx)
        }

        ctx.line.parse = ctx

        return ctx
    }

    public parseNode(precedence: number, ctx: ParserContext): Node {
        let token = this.consumeToken(null, ctx)
        if (!token) {
            this.error('Reached end of token stream unexpectedly', undefined, ctx)
            return new Node(NodeType.invalid, new Token(TokenType.unknown, '', ctx.line.text.length, 0), [])
        }
        if (!PrefixNodeRules[token.type]) {
            this.error('No prefix rule matches', token, ctx)
            return new Node(NodeType.invalid, token, [])
        }
        let left = PrefixNodeRules[token.type](token, ctx, this)
        while (token && precedence < this.peekPrecedence(true, ctx)) {
            token = this.consumeToken(null, ctx)
            if (token && InfixNodeRules[token.type]) {
                left = InfixNodeRules[token.type](left, token, ctx, this)
            }
        }
        return left
    }

    public peekToken(type: TokenType | null, ctx: ParserContext): Token | undefined {
        const token = ctx.tokens[ctx.tokens.length - 1]
        if (token && type && token.type !== type) { return undefined }
        return token
    }

    public consumeToken(type: TokenType | null, ctx: ParserContext): Token | undefined {
        const token = ctx.tokens.pop()
        if (token && type && token.type !== type) {
            this.error(`Expected ${TokenType[type]} instead`, token, ctx)
        } else if (!token && type) {
            this.error(`Expected ${TokenType[type]} but reached end of token stream`, undefined, ctx)
        }
        return token
    }

    public peekPrecedence(infix: boolean, ctx: ParserContext): number {
        if (ctx.tokens.length === 0) { return 0 }
        return this.getPrecedence(infix, ctx.tokens[ctx.tokens.length - 1])
    }

    public getPrecedence(infix: boolean, token: Token): number {
        const key = token.value.toLowerCase()
        const map = infix ? InfixPrecedenceRules : PrefixPrecedenceRules
        if (map[key]) { return map[key] }
        if (map[token.type]) { return map[token.type] }
        return 0
    }

    public error(msg: string, token: Token | undefined, ctx: ParserContext): void {
        ctx.diagnostics.push(new Diagnostic('Parser', msg, 'error', token, ctx.line))
    }
}
