import TokenType from '../TokenType'
import TokenNestingRule from './TokenNestingRule'

const TokenNestingRules: { [key: number]: TokenNestingRule } = {
    [TokenType.string_escape]: [TokenType.string, TokenType.macro_argument],
    [TokenType.string_interpolation]: [TokenType.string, TokenType.macro_argument],
    [TokenType.macro_escape]: [TokenType.string, TokenType.macro_argument],
    [TokenType.semicolon_comment]: [TokenType.macro_call],
    [TokenType.comma]: [TokenType.macro_call],
    [TokenType.macro_argument]: [TokenType.macro_call]
}

export default TokenNestingRules
