import Diagnostic from '../Diagnostic'
import Logger from '../Logger'
import Node from './Node'
import NodeType from './NodeType'
import ParserContext from './ParserContext'
import Token from './Token'
import TokenType from './TokenType'

type ParserPrefixRule = (token: Token, ctx: ParserContext) => Node
type ParserInfixRule = (left: Node, token: Token, ctx: ParserContext) => Node

export default class Parser {
    public logger: Logger

    public prefixRules: { [key: number]: ParserPrefixRule } = {
        [TokenType.start_of_line]: (token, ctx) => {
            if (this.peekToken(TokenType.end_of_line, ctx)) {
                this.consumeToken(TokenType.end_of_line, ctx)
                return new Node(NodeType.line, token, [])
            } else {
                const children: Node[] = []
                if (this.peekToken(TokenType.identifier, ctx)) {
                    const right = this.parseNode(99, ctx)
                    right.type = NodeType.label
                    children.push(right)
                }
                const opToken = this.peekToken(TokenType.operator, ctx)
                if (opToken && children.length && opToken.value === '=') {
                    const right = this.parseNode(99, ctx)
                    children.push(right)
                }
                const kwToken = this.peekToken(TokenType.keyword, ctx)
                if (kwToken && (!children.length || children[0].token.value.endsWith(':'))) {
                    const opcode = kwToken.value.toLowerCase()
                    if (opcode === 'set' || opcode === 'rl') {
                        kwToken.type = TokenType.opcode
                    }
                }
                while (this.peekToken(null, ctx) && !this.peekToken(TokenType.end_of_line, ctx)) {
                    const right = this.parseNode(99, ctx)
                    children.push(right)
                }
                this.consumeToken(TokenType.end_of_line, ctx)
                return new Node(NodeType.line, token, children)
            }
        },
        [TokenType.semicolon_comment]: (token) => {
            return new Node(NodeType.comment, token, [])
        },
        [TokenType.asterisk_comment]: (token) => {
            return new Node(NodeType.comment, token, [])
        },
        [TokenType.directive]: (token) => {
            return new Node(NodeType.directive, token, [])
        },
        [TokenType.string]: (token) => {
            return new Node(NodeType.string, token, [])
        },
        [TokenType.operator]: (token, ctx) => {
            const right = this.parseNode(this.getPrecedence(false, token), ctx)
            return new Node(NodeType.unary_operator, token, [right])
        },
        [TokenType.keyword]: (token, ctx) => {
            const children: Node[] = []
            if (!this.peekToken(TokenType.semicolon_comment, ctx) && !this.peekToken(TokenType.end_of_line, ctx)) {
                let right = this.parseNode(0, ctx)
                children.push(right)
                while (this.peekToken(TokenType.comma, ctx)) {
                    this.consumeToken(TokenType.comma, ctx)
                    right = this.parseNode(0, ctx)
                    children.push(right)
                }
            }
            return new Node(NodeType.keyword, token, children)
        },
        [TokenType.region]: (token) => {
            return new Node(NodeType.region, token, [])
        },
        [TokenType.function]: (token) => {
            return new Node(NodeType.function, token, [])
        },
        [TokenType.opcode]: (token, ctx) => {
            const children: Node[] = []
            if (!this.peekToken(TokenType.semicolon_comment, ctx) && !this.peekToken(TokenType.end_of_line, ctx)) {
                let right = this.parseNode(0, ctx)
                children.push(right)
                while (this.peekToken(TokenType.comma, ctx)) {
                    this.consumeToken(TokenType.comma, ctx)
                    right = this.parseNode(0, ctx)
                    children.push(right)
                }
            }
            return new Node(NodeType.opcode, token, children)
        },
        [TokenType.macro_call]: (token, ctx) => {
            const children: Node[] = []
            if (this.peekToken(TokenType.macro_argument, ctx)) {
                let right = this.parseNode(0, ctx)
                children.push(right)
                while (this.peekToken(TokenType.comma, ctx)) {
                    this.consumeToken(TokenType.comma, ctx)
                    right = this.parseNode(0, ctx)
                    children.push(right)
                }
            }
            return new Node(NodeType.macro_call, token, children)

        },
        [TokenType.macro_argument]: (token) => {
            return new Node(NodeType.string, token, [])
        },
        [TokenType.register]: (token) => {
            return new Node(NodeType.register, token, [])
        },
        [TokenType.condition]: (token) => {
            return new Node(NodeType.condition, token, [])
        },
        [TokenType.identifier]: (token) => {
            return new Node(NodeType.identifier, token, [])
        },
        [TokenType.fixed_point_number]: (token) => {
            return new Node(NodeType.number_literal, token, [])
        },
        [TokenType.decimal_number]: (token) => {
            return new Node(NodeType.number_literal, token, [])
        },
        [TokenType.hex_number]: (token) => {
            return new Node(NodeType.number_literal, token, [])
        },
        [TokenType.binary_number]: (token) => {
            return new Node(NodeType.number_literal, token, [])
        },
        [TokenType.octal_number]: (token) => {
            return new Node(NodeType.number_literal, token, [])
        },
        [TokenType.gbgfx_number]: (token) => {
            return new Node(NodeType.number_literal, token, [])
        },
        [TokenType.open_bracket]: (token, ctx) => {
            const right = this.parseNode(this.getPrecedence(false, token), ctx)
            this.consumeToken(TokenType.close_bracket, ctx)
            return new Node(NodeType.indexer, token, [right])
        },
        [TokenType.open_paren]: (token, ctx) => {
            const right = this.parseNode(this.getPrecedence(false, token), ctx)
            this.consumeToken(TokenType.close_paren, ctx)
            return right
        }
    }

    public infixRules: { [key: number]: ParserInfixRule } = {
        [TokenType.operator]: (left, token, ctx) => {
            return new Node(NodeType.binary_operator, token, [left, this.parseNode(this.getPrecedence(true, token), ctx)])
        },
        [TokenType.colon]: (left) => {
            return left
        },
        [TokenType.open_bracket]: (left, token, ctx) => {
            const right = this.parseNode(0, ctx)
            this.consumeToken(TokenType.close_bracket, ctx)
            const node = new Node(NodeType.indexer, token, [right])
            left.children.push(node)
            return left
        },
        [TokenType.open_paren]: (left, token, ctx) => {
            const children: Node[] = []
            children.push(left)
            let right = this.parseNode(0, ctx)
            children.push(right)
            while (this.peekToken(TokenType.comma, ctx)) {
                this.consumeToken(TokenType.comma, ctx)
                right = this.parseNode(0, ctx)
                children.push(right)
            }
            this.consumeToken(TokenType.close_paren, ctx)
            return new Node(NodeType.function_call, token, children)
        }
    }

    public infixPrecedence: { [key: string]: number } = {
        '&&': 2,
        '||': 2,
        '==': 3,
        '>=': 3,
        '<=': 3,
        '!=': 3,
        '<': 3,
        '>': 3,
        '+': 4,
        '-': 4,
        '&': 5,
        '|': 5,
        '^': 5,
        '<<': 6,
        '>>': 6,
        '*': 7,
        '/': 7,
        '%': 7,
        '(': 9,
        '[': 9,
        ':': 100
    }

    public prefixPrecedence: { [key: string]: number } = {
        '!': 1,
        '~': 8,
        '+': 8,
        '-': 8
    }

    constructor(logger: Logger) {
        this.logger = logger
    }

    public async parse(ctx: ParserContext): Promise<ParserContext> {
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
        if (!this.prefixRules[token.type]) {
            this.error('No prefix rule matches', token, ctx)
            return new Node(NodeType.invalid, token, [])
        }
        let left = this.prefixRules[token.type](token, ctx)
        while (token && precedence < this.peekPrecedence(true, ctx)) {
            token = this.consumeToken(null, ctx)
            if (token && this.infixRules[token.type]) {
                left = this.infixRules[token.type](left, token, ctx)
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
        const map = infix ? this.infixPrecedence : this.prefixPrecedence
        if (map[key]) { return map[key] }
        if (map[token.type]) { return map[token.type] }
        return 0
    }

    public error(msg: string, token: Token | undefined, ctx: ParserContext): void {
        ctx.diagnostics.push(new Diagnostic('Parser', msg, 'error', token, ctx.line))
    }
}
