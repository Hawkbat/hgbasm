import ExprType from '../Linker/ExprType'

const LinkExprBinaryRules: { [key: string]: ExprType } = {
    '+': ExprType.add,
    '-': ExprType.subtract,
    '*': ExprType.multiply,
    '/': ExprType.divide,
    '%': ExprType.modulo,
    '|': ExprType.bitwise_or,
    '&': ExprType.bitwise_and,
    '^': ExprType.bitwise_xor,
    '&&': ExprType.and,
    '||': ExprType.or,
    '==': ExprType.equal,
    '!=': ExprType.not_equal,
    '>': ExprType.greater_than,
    '<': ExprType.less_than,
    '>=': ExprType.greater_or_equal,
    '<=': ExprType.less_or_equal,
    '<<': ExprType.shift_left,
    '>>': ExprType.shift_right
}

export default LinkExprBinaryRules
