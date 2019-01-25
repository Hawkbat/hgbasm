import CompilerContext from './CompilerContext'
import IFixerOptions from './IFixerOptions'

export default class FixerContext {
    public options: IFixerOptions
    public context: CompilerContext
    public romData?: Uint8Array

    constructor(options: IFixerOptions, context: CompilerContext) {
        this.options = options
        this.context = context
    }
}
