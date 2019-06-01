import FileContext from '../Assembler/FileContext'
import LineContext from '../Assembler/LineContext'
import Diagnostic from '../Diagnostic'
import IDelta from './IDelta'
import IFormatterOptions from './IFormatterOptions'

export default class FormatterContext {
    public options: IFormatterOptions
    public file: FileContext
    public startLine: number
    public endLine: number
    public diagnostics: Diagnostic[] = []
    public deltas: IDelta[] = []
    public line: LineContext

    constructor(options: IFormatterOptions, file: FileContext, startLine: number, endLine: number) {
        this.options = options
        this.file = file
        this.startLine = startLine
        this.endLine = endLine
        this.line = file.lines[startLine]
    }
}
