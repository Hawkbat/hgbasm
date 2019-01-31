import Diagnostic from '../Diagnostic'
import ILineState from '../LineState/ILineState'
import LineContext from './LineContext'
import Token from './Token'

export default class LexerContext {
    public line: LineContext
    public diagnostics: Diagnostic[]
    public state: ILineState
    public tokens: Token[] = []

    constructor(line: LineContext, diagnostics: Diagnostic[], state: ILineState) {
        this.line = line
        this.diagnostics = diagnostics
        this.state = state
    }
}
