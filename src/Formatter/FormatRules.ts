import NodeType from '../NodeType'
import FormatRule from './FormatRule'

const PSEUDO_OPS = ['rereset', 'rsset', 'rb', 'rw', 'rl', 'db', 'dw', 'dl', 'ds']

const FormatRules: { [key: number]: FormatRule } = {
    [NodeType.binary_operator]: (n, ctx, f) => `${f.formatNode(n.children[0], ctx)} ${n.token.value} ${f.formatNode(n.children[1], ctx)}`,
    [NodeType.comment]: (n) => n.token.value,
    [NodeType.condition]: (n, ctx, f) => f.capitalize(n.token.value, ctx.options.conditionCodeCase),
    [NodeType.directive]: (n) => n.token.value,
    [NodeType.function]: (n, ctx, f) => f.capitalize(n.token.value, ctx.options.functionCase),
    [NodeType.function_call]: (n, ctx, f) => `${f.formatNode(n.children[0], ctx)}(${n.children.slice(1).map((c) => f.formatNode(c, ctx)).join(', ')})`,
    [NodeType.identifier]: (n, ctx, f) => {
        const id = n.token.value.toLowerCase()
        if (id === 'align' || id === 'bank') {
            return `${f.capitalize(id, ctx.options.keywordCase)}${n.children.length ? f.formatNode(n.children[0], ctx) : ''}`
        }
        return n.token.value
    },
    [NodeType.indexer]: (n, ctx, f) => `[${f.formatNode(n.children[0], ctx)}]`,
    [NodeType.keyword]: (n, ctx, f) => {
        const id = n.token.value.toLowerCase()
        let str = PSEUDO_OPS.includes(id) ?
            f.capitalize(n.token.value, ctx.options.pseudoOpCase) :
            f.capitalize(n.token.value, ctx.options.keywordCase)
        if (n.children.length) {
            str += ` ${n.children.map((c) => f.formatNode(c, ctx)).join(', ')}`
        }
        return str
    },
    [NodeType.label]: (n) => n.token.value,
    [NodeType.line]: (n, ctx, f) => {
        if (!n.children.length) {
            return ''
        }
        const first = n.children[0]
        const indent = first.type === NodeType.opcode ||
            first.type === NodeType.macro_call ||
            (first.type === NodeType.comment && first.token.col > 0) ||
            (first.type === NodeType.keyword && PSEUDO_OPS.includes(first.token.value.toLowerCase()))
        return `${indent ? f.indent(ctx) : ''}${f.formatNode(first, ctx)}${n.children.slice(1).map((c) => ` ${f.formatNode(c, ctx)}`).join('')}`
    },
    [NodeType.macro_call]: (n, ctx, f) => `${n.token.value}${n.children.map((c) => f.formatNode(c, ctx)).join(',')}`,
    [NodeType.number_literal]: (n, ctx, f) => f.capitalize(n.token.value, ctx.options.hexLetterCase),
    [NodeType.opcode]: (n, ctx, f) => {
        let str = f.capitalize(n.token.value, ctx.options.opcodeCase)
        if (n.children.length) {
            str += ` ${n.children.map((c) => f.formatNode(c, ctx)).join(', ')}`
        }
        return str
    },
    [NodeType.region]: (n, ctx, f) => `${f.capitalize(n.token.value, ctx.options.regionCase)}${n.children.length ? f.formatNode(n.children[0], ctx) : ''}`,
    [NodeType.register]: (n, ctx, f) => f.capitalize(n.token.value, ctx.options.registerCase),
    [NodeType.string]: (n) => n.token.value,
    [NodeType.unary_operator]: (n, ctx, f) => `${n.token.value}${f.formatNode(n.children[0], ctx)}`
}

export default FormatRules
