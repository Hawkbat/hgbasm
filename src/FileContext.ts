import AsmFile from './AsmFile'
import CompilerContext from './CompilerContext'
import LineContext from './LineContext'

export default class FileContext {
    public context: CompilerContext
    public parent: FileContext | null
    public source: AsmFile
    public scope: string
    public lines: LineContext[]
    public startLine: number
    public endLine: number

    constructor(context: CompilerContext, parent: FileContext | null, source: AsmFile, scope: string = source.path, startLine: number = 0, endLine: number = source.lines.length - 1) {
        this.context = context
        this.parent = parent
        this.source = source
        this.scope = scope
        this.lines = source.lines.map((line) => new LineContext(this, line))
        this.startLine = startLine
        this.endLine = endLine
    }

    public getRoot(): FileContext {
        if (this.parent) {
            return this.parent.getRoot()
        }
        return this
    }
}
