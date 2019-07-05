import AssemblerContext from '../Assembler/AssemblerContext'
import IAssemblerOptions from '../Assembler/IAssemblerOptions'
import LineContext from '../Assembler/LineContext'
import ILineMeta from '../LineState/ILineMeta'

export default class EvaluatorContext {
    public context: AssemblerContext
    public line: LineContext
    public meta: ILineMeta
    public options: IAssemblerOptions

    constructor(context: AssemblerContext, line: LineContext) {
        this.context = context
        this.line = line
        this.meta = {}
        this.options = context.options
    }
}
