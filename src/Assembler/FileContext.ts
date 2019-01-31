import AsmFile from '../AsmFile'
import LineContext from './LineContext'

export default class FileContext {
    public source: AsmFile
    public parent?: FileContext
    public scope: string
    public lines: LineContext[]
    public startLine: number
    public endLine: number

    constructor(source: AsmFile, parent?: FileContext, scope: string = source.path, startLine: number = 0, endLine: number = source.lines.length - 1) {
        this.source = source
        this.parent = parent
        this.scope = scope
        this.lines = source.lines.map((line) => new LineContext(this, line))
        this.startLine = startLine
        this.endLine = endLine
    }
}
