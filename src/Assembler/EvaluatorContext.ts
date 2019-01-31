import Diagnostic from '../Diagnostic'
import ILineState from '../LineState/ILineState'
import AssemblerContext from './AssemblerContext'
import IAssemblerOptions from './IAssemblerOptions'
import LineContext from './LineContext'

export default class EvaluatorContext {
    public context: AssemblerContext
    public line: LineContext
    public diagnostics: Diagnostic[]
    public state: ILineState
    public options: IAssemblerOptions

    constructor(context: AssemblerContext, line: LineContext, diagnostics: Diagnostic[], state: ILineState) {
        this.context = context
        this.line = line
        this.diagnostics = diagnostics
        this.state = state ? state : { line: 0, file: '' }
        this.state.line = line.getLineNumber()
        this.state.file = line.file.source.path
        this.options = context.options
    }
}
