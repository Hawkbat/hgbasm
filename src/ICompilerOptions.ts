import IEvaluatorOptions from './IEvaluatorOptions'
import IFixerOptions from './IFixerOptions'
import ILexerOptions from './ILexerOptions'
import ILinkerOptions from './ILinkerOptions'
import IParserOptions from './IParserOptions'

export default interface ICompilerOptions {
    lexer: ILexerOptions
    parser: IParserOptions
    evaluator: IEvaluatorOptions
    linker: ILinkerOptions
    fixer: IFixerOptions
}
