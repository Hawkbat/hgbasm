import Diagnostic from '../Diagnostic'
import ILineState from '../LineState/ILineState'
import LineContext from '../Assembler/LineContext'
import Node from '../Node'
import Token from '../Token'

export default class ParserContext {
    public line: LineContext
    public diagnostics: Diagnostic[]
    public tokens: Token[] = []
    public state: ILineState
    public node?: Node

    constructor(line: LineContext, diagnostics: Diagnostic[], state: ILineState) {
        this.line = line
        this.diagnostics = diagnostics
        this.state = state
    }
}
