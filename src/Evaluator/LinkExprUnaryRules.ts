import ExprType from '../Linker/ExprType'

const LinkExprUnaryRules: { [key: string]: ExprType } = {
    '-': ExprType.negate,
    '~': ExprType.bitwise_not,
    '!': ExprType.not
}

export default LinkExprUnaryRules
