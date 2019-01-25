import AsmLine from './AsmLine'
import EvaluatorContext from './EvaluatorContext'
import FileContext from './FileContext'
import LexerContext from './LexerContext'
import ParserContext from './ParserContext'

export default class LineContext {
    public file: FileContext
    public source: AsmLine
    public text: string

    public lex?: LexerContext
    public parse?: ParserContext
    public eval?: EvaluatorContext

    constructor(file: FileContext, line: AsmLine) {
        this.file = file
        this.source = line
        this.text = line.text
    }

    public getLineNumber(): number {
        return this.file.lines.indexOf(this)
    }
}
