import CompilerContext from './CompilerContext'
import ILinkerOptions from './ILinkerOptions'
export default class LinkerContext {
    public options: ILinkerOptions
    public context: CompilerContext
    public romData?: Uint8Array
    public symbolData?: string

    constructor(options: ILinkerOptions, context: CompilerContext) {
        this.options = options
        this.context = context
    }
}
