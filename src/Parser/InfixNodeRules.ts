import Node from '../Node'
import NodeType from '../NodeType'
import TokenType from '../TokenType'
import InfixNodeRule from './InfixNodeRule'

const InfixNodeRules: { [key: number]: InfixNodeRule } = {
    [TokenType.operator]: (left, token, ctx, p) => {
        return new Node(NodeType.binary_operator, token, [left, p.parseNode(p.getPrecedence(true, token), ctx)])
    },
    [TokenType.colon]: (left) => {
        return left
    },
    [TokenType.open_bracket]: (left, token, ctx, p) => {
        const children: Node[] = []
        if (!p.peekToken(TokenType.close_bracket, ctx)) {
            const right = p.parseNode(0, ctx)
            children.push(right)
        }
        p.consumeToken(TokenType.close_bracket, ctx)
        const node = new Node(NodeType.indexer, token, children)
        left.children.push(node)
        return left
    },
    [TokenType.open_paren]: (left, token, ctx, p) => {
        const children: Node[] = []
        children.push(left)
        if (!p.peekToken(TokenType.close_paren, ctx)) {
            let right = p.parseNode(0, ctx)
            children.push(right)
            while (p.peekToken(TokenType.comma, ctx)) {
                p.consumeToken(TokenType.comma, ctx)
                right = p.parseNode(0, ctx)
                children.push(right)
            }
        }
        p.consumeToken(TokenType.close_paren, ctx)
        return new Node(NodeType.function_call, token, children)
    }
}

export default InfixNodeRules
