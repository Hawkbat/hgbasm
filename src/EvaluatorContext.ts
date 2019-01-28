import IEvaluatorOptions from './IEvaluatorOptions'
import ILineState from './ILineState'
import LineContext from './LineContext'

export default class EvaluatorContext {
    public options: IEvaluatorOptions
    public line: LineContext
    public state: ILineState

    constructor(options: IEvaluatorOptions, line: LineContext, state?: ILineState) {
        this.options = options
        this.line = line
        this.state = state ? state : { line: 0, file: '' }
        this.state.line = line.getLineNumber()
        this.state.file = line.file.source.path

        if (options.debugDefineName) {
            this.state.stringEquates = this.state.stringEquates ? this.state.stringEquates : {}
            this.state.stringEquates[options.debugDefineName] = options.debugDefineValue
        }
    }
}
