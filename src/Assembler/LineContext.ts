import AsmLine from '../AsmLine'
import EvaluatorContext from '../Evaluator/EvaluatorContext'
import LexerContext from '../Lexer/LexerContext'
import ParserContext from '../Parser/ParserContext'
import FileContext from './FileContext'

export default class LineContext {
    public file: FileContext
    public lineNumber: number
    public source: AsmLine
    public text: string

    public lex?: LexerContext
    public parse?: ParserContext
    public eval?: EvaluatorContext

    constructor(file: FileContext, line: AsmLine) {
        this.file = file
        this.source = line
        this.text = line.text
        this.lineNumber = line.file.lines.indexOf(line)
    }
}
