import AssemblerContext from '../Assembler/AssemblerContext'
import Token from '../Token'
import IAutoCompleterOptions from './IAutoCompleterOptions'
import IAutoCompleterResult from './IAutoCompleterResult'

export default class AutoCompleterContext {
    public options: IAutoCompleterOptions
    public context: AssemblerContext
    public previous: Token | null
    public results?: IAutoCompleterResult

    constructor(options: IAutoCompleterOptions, context: AssemblerContext, previous: Token | null) {
        this.options = options
        this.context = context
        this.previous = previous
    }
}
