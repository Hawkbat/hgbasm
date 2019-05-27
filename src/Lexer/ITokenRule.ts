import TokenType from '../TokenType'
import LexerRule from './LexerRule'

export default interface ITokenRule {
    type: TokenType
    start?: LexerRule
    end?: LexerRule
    endLookahead?: boolean
    rules?: LexerRule[]
    startOfLine?: boolean
    onlyAsSubToken?: boolean
}
