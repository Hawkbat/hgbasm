import IParserOptions from './IParserOptions'
import LineContext from './LineContext'
import Node from './Node'
import Token from './Token'

export default class ParserContext {
    public options: IParserOptions
    public line: LineContext
    public tokens: Token[] = []
    public node?: Node

    constructor(options: IParserOptions, line: LineContext) {
        this.options = options
        this.line = line
    }
}
