import Node from '../Node'
import Formatter from './Formatter'
import FormatterContext from './FormatterContext'

type FormatRule = (n: Node, ctx: FormatterContext, f: Formatter) => string

export default FormatRule
