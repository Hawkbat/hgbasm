import Diagnostic from '../Diagnostic'
import ILineState from '../LineState/ILineState'
import LineContext from './LineContext'
import Token from './Token'
import TokenType from './TokenType'

export default class LexerContext {
    public line: LineContext
    public diagnostics: Diagnostic[]
    public state: ILineState
    public tokens: Token[] = []
    public inType?: TokenType

    constructor(line: LineContext, diagnostics: Diagnostic[], state: ILineState) {
        this.line = line
        this.diagnostics = diagnostics
        this.state = state
    }
}
