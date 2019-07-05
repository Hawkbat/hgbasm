import AssemblerContext from '../Assembler/AssemblerContext'
import LineContext from '../Assembler/LineContext'
import Node from '../Node'
import Token from '../Token'

export default class ParserContext {
    public context: AssemblerContext
    public line: LineContext
    public tokens: Token[] = []
    public node?: Node

    constructor(context: AssemblerContext, line: LineContext) {
        this.context = context
        this.line = line
    }
}
