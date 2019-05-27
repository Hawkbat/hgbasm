import Node from '../Node'
import Parser from './Parser'
import ParserContext from './ParserContext'
import Token from '../Token'

type PrefixNodeRule = (token: Token, ctx: ParserContext, parser: Parser) => Node

export default PrefixNodeRule
