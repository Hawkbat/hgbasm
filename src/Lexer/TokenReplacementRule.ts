import ILineState from '../LineState/ILineState'
import Token from '../Token'
import TokenType from '../TokenType'
import Lexer from './Lexer'
import LexerContext from './LexerContext'

type TokenReplacementRule = (token: Token, inType: TokenType | undefined, state: ILineState, ctx: LexerContext, lex: Lexer) => void

export default TokenReplacementRule
