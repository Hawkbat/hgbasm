import Node from '../Node'
import NodeType from '../NodeType'
import TokenType from '../TokenType'
import PrefixNodeRule from './PrefixNodeRule'

const PrefixNodeRules: { [key: number]: PrefixNodeRule } = {
    [TokenType.start_of_line]: (token, ctx, p) => {
        if (p.peekToken(TokenType.end_of_line, ctx)) {
            p.consumeToken(TokenType.end_of_line, ctx)
            return new Node(NodeType.line, token, [])
        } else {
            const children: Node[] = []
            if (p.peekToken(TokenType.directive, ctx)) {
                const right = p.parseNode(99, ctx)
                children.push(right)
            } else {
                if (p.peekToken(TokenType.identifier, ctx)) {
                    const right = p.parseNode(99, ctx)
                    right.type = NodeType.label
                    children.push(right)
                }
                if (p.peekToken(TokenType.keyword, ctx) || p.peekToken(TokenType.opcode, ctx) || p.peekToken(TokenType.macro_call, ctx)) {
                    const kwToken = p.peekToken(TokenType.keyword, ctx)
                    if (kwToken && kwToken.col > 0 && (!children.length || children[0].token.value.endsWith(':'))) {
                        const opcode = kwToken.value.toLowerCase()
                        if (opcode === 'set' || opcode === 'rl') {
                            kwToken.type = TokenType.opcode
                        }
                    }
                    const right = p.parseNode(99, ctx)
                    children.push(right)
                }
            }
            if (p.peekToken(TokenType.semicolon_comment, ctx)) {
                const right = p.parseNode(99, ctx)
                children.push(right)
            }
            while (p.peekToken(null, ctx) && !p.peekToken(TokenType.end_of_line, ctx)) {
                const right = p.parseNode(99, ctx)
                p.error(`Unexpected ${NodeType[right.type]}`, right.token, ctx)
                children.push(right)
            }
            p.consumeToken(TokenType.end_of_line, ctx)
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
    [TokenType.operator]: (token, ctx, p) => {
        const right = p.parseNode(p.getPrecedence(false, token), ctx)
        return new Node(NodeType.unary_operator, token, [right])
    },
    [TokenType.keyword]: (token, ctx, p) => {
        const children: Node[] = []
        if (!p.peekToken(TokenType.semicolon_comment, ctx) && !p.peekToken(TokenType.end_of_line, ctx)) {
            let right = p.parseNode(0, ctx)
            children.push(right)
            while (p.peekToken(TokenType.comma, ctx)) {
                p.consumeToken(TokenType.comma, ctx)
                right = p.parseNode(0, ctx)
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
    [TokenType.opcode]: (token, ctx, p) => {
        const children: Node[] = []
        if (!p.peekToken(TokenType.semicolon_comment, ctx) && !p.peekToken(TokenType.end_of_line, ctx)) {
            let right = p.parseNode(0, ctx)
            children.push(right)
            while (p.peekToken(TokenType.comma, ctx)) {
                p.consumeToken(TokenType.comma, ctx)
                right = p.parseNode(0, ctx)
                children.push(right)
            }
        }
        return new Node(NodeType.opcode, token, children)
    },
    [TokenType.macro_call]: (token, ctx, p) => {
        const children: Node[] = []
        if (p.peekToken(TokenType.macro_argument, ctx)) {
            let right = p.parseNode(0, ctx)
            children.push(right)
            while (p.peekToken(TokenType.comma, ctx)) {
                p.consumeToken(TokenType.comma, ctx)
                right = p.parseNode(0, ctx)
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
    [TokenType.open_bracket]: (token, ctx, p) => {
        const children: Node[] = []
        if (!p.peekToken(TokenType.close_bracket, ctx)) {
            const right = p.parseNode(p.getPrecedence(false, token), ctx)
            children.push(right)
        }
        p.consumeToken(TokenType.close_bracket, ctx)
        return new Node(NodeType.indexer, token, children)
    },
    [TokenType.open_paren]: (token, ctx, p) => {
        const right = p.parseNode(p.getPrecedence(false, token), ctx)
        p.consumeToken(TokenType.close_paren, ctx)
        return right
    }
}

export default PrefixNodeRules
