import AssemblerContext from '../Assembler/AssemblerContext'
import LineContext from '../Assembler/LineContext'
import Token from '../Token'
import TokenType from '../TokenType'

export default class LexerContext {
    public context: AssemblerContext
    public line: LineContext
    public tokens: Token[] = []
    public inType?: TokenType

    constructor(context: AssemblerContext, line: LineContext) {
        this.context = context
        this.line = line
    }
}
