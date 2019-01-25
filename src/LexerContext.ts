import ILexerOptions from './ILexerOptions'
import LineContext from './LineContext'
import Token from './Token'

export default class LexerContext {
    public options: ILexerOptions
    public line: LineContext
    public tokens: Token[] = []

    constructor(options: ILexerOptions, line: LineContext) {
        this.options = options
        this.line = line
    }
}
