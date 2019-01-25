import AsmFile from './AsmFile'
import CompilerContext from './CompilerContext'
import DeepPartial from './DeepPartial'
import Evaluator from './Evaluator'
import FileContext from './FileContext'
import Fixer from './Fixer'
import ICompilerOptions from './ICompilerOptions'
import Lexer from './Lexer'
import Linker from './Linker'
import Logger, { LogLevel } from './Logger'
import Parser from './Parser'

export default class Compiler {
    public lexer: Lexer
    public parser: Parser
    public evaluator: Evaluator
    public linker: Linker
    public fixer: Fixer
    public logger: Logger

    public stopped: boolean = false

    constructor(logLevel: LogLevel = 'info') {
        this.lexer = new Lexer(this)
        this.parser = new Parser(this)
        this.evaluator = new Evaluator(this)
        this.linker = new Linker(this)
        this.fixer = new Fixer(this)
        this.logger = new Logger(logLevel)
    }

    public compile(files: AsmFile[], includes: AsmFile[], options?: DeepPartial<ICompilerOptions>): CompilerContext {
        const ctx = new CompilerContext(files, includes, options)
        for (const file of ctx.files) {
            this.logger.log('compileInfo', `Compiling ${file.source.path}`)
            try {
                this.compileFile(file, ctx.options)
            } catch (err) {
                this.logger.log('compileCrash', `A fatal error occurred during compilation.\n${err.stack}`)
                this.stopped = true
            }

            const fileDiags = ctx.diagnostics.filter((diag) => diag.line.file.getRoot() === file)

            const fileErrorCount = fileDiags.filter((diag) => diag.type === 'error').length
            const fileWarnCount = fileDiags.filter((diag) => diag.type === 'warn').length

            this.logger.log('compileInfo', `Compilation of ${file.source.path} ${fileErrorCount ? 'failed' : 'finished'} with ${fileErrorCount} ${fileErrorCount === 1 ? 'error' : 'errors'} and ${fileWarnCount} ${fileWarnCount === 1 ? 'warning' : 'warnings'}`)

        }

        const compileDiags = ctx.diagnostics.slice()

        ctx.link = this.linker.link(ctx, ctx.options.linker)
        ctx.symbolData = ctx.link.symbolData

        const linkDiags = ctx.diagnostics.filter((diag) => !compileDiags.includes(diag)).map((diag) => {
            diag.area = 'Linker'
            return diag
        })

        const linkErrorCount = linkDiags.filter((diag) => diag.type === 'error').length
        const linkWarnCount = linkDiags.filter((diag) => diag.type === 'warn').length

        this.logger.log('compileInfo', `Linking ${linkErrorCount ? 'failed' : 'finished'} with ${linkErrorCount} ${linkErrorCount === 1 ? 'error' : 'errors'} and ${linkWarnCount} ${linkWarnCount === 1 ? 'warning' : 'warnings'}`)

        ctx.fix = this.fixer.fix(ctx, ctx.options.fixer)
        ctx.romData = ctx.fix.romData

        this.logger.log('compileInfo', `Fixing ${!ctx.fix.romData ? 'failed' : 'finished'}`)

        for (const diag of ctx.diagnostics.slice(0, 10)) {
            if (diag.type === 'error') {
                this.logger.log('diagnosticError', diag.toString())
            } else if (diag.type === 'warn') {
                this.logger.log('diagnosticWarn', diag.toString())
            } else if (diag.type === 'info') {
                this.logger.log('diagnosticInfo', diag.toString())
            }
        }
        return ctx
    }

    public compileFile(file: FileContext, options: ICompilerOptions): void {
        for (let i = file.startLine; i <= file.endLine; i++) {
            const line = file.lines[i]
            this.logger.log('lineSource', `${line.file.source.path} (${i})`, line.source.text)

            this.lexer.lex(line, options.lexer)
            this.parser.parse(line, options.parser)
            this.evaluator.evaluate(line, options.evaluator)

            if (!this.stopped && file.context.diagnostics.some((diag) => diag.line.file === file && diag.type === 'error')) {
                if (line.lex && line.lex.tokens) {
                    for (const token of line.lex.tokens) {
                        this.logger.log('tokenStream', token.toString())
                    }
                }
                if (line.parse && line.parse.node) {
                    this.logger.log('lineNode', line.parse.node.toString())
                }
                if (line.eval) {
                    this.logger.log('lineState', JSON.stringify(line.eval.afterState, null, 4))
                }
                this.stopped = true
            }
            if (this.stopped) {
                break
            }
        }
    }
}
