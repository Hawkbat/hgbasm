import Diagnostic from '../Diagnostic'
import ILineMeta from '../LineState/ILineMeta'
import ILineState from '../LineState/ILineState'
import AssemblerContext from '../Assembler/AssemblerContext'
import IAssemblerOptions from '../Assembler/IAssemblerOptions'
import LineContext from '../Assembler/LineContext'

export default class EvaluatorContext {
    public context: AssemblerContext
    public line: LineContext
    public diagnostics: Diagnostic[]
    public state: ILineState
    public meta: ILineMeta
    public options: IAssemblerOptions

    constructor(context: AssemblerContext, line: LineContext, diagnostics: Diagnostic[], state: ILineState) {
        this.context = context
        this.line = line
        this.diagnostics = diagnostics
        this.state = state ? state : { line: 0, file: '' }
        this.state.line = line.lineNumber
        this.state.file = line.file.source.path
        this.meta = {}
        this.options = context.options
    }
}
