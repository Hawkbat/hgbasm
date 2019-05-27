import Node from '../Node'
import Token from '../Token'
import Parser from './Parser'
import ParserContext from './ParserContext'

type InfixNodeRule = (left: Node, token: Token, ctx: ParserContext, parser: Parser) => Node

export default InfixNodeRule
