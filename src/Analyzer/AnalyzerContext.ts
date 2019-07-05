import AssemblerContext from '../Assembler/AssemblerContext'
import IAnalyzerOptions from './IAnalyzerOptions'
import IAnalyzerResult from './IAnalyzerResult'

export default class AnalyzerContext {
    public options: IAnalyzerOptions
    public context: AssemblerContext
    public results?: IAnalyzerResult

    constructor(options: IAnalyzerOptions, context: AssemblerContext) {
        this.options = options
        this.context = context
    }
}
