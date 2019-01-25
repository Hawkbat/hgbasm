import IEvaluatorOptions from './IEvaluatorOptions'
import ILineState from './ILineState'
import LineContext from './LineContext'

export default class EvaluatorContext {
    public options: IEvaluatorOptions
    public line: LineContext
    public beforeState: ILineState
    public afterState: ILineState

    constructor(options: IEvaluatorOptions, line: LineContext, beforeState?: ILineState) {
        this.options = options
        this.line = line
        this.beforeState = { ...beforeState, line: line.getLineNumber(), file: line.file.source.path }
        this.afterState = { ...this.beforeState }
    }
}
