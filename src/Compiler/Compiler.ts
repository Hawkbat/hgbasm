import AsmFile from '../AsmFile'
import Assembler from '../Assembler/Assembler'
import AssemblerContext from '../Assembler/AssemblerContext'
import FileContext from '../Assembler/FileContext'
import DeepPartial from '../DeepPartial'
import Diagnostic from '../Diagnostic'
import Fixer from '../Fixer/Fixer'
import FixerContext from '../Fixer/FixerContext'
import IFileProvider from '../IFileProvider'
import Linker from '../Linker/Linker'
import LinkerContext from '../Linker/LinkerContext'
import Logger, { LogLevel } from '../Logger'
import CompilerContext from './CompilerContext'
import ICompilerOptions from './ICompilerOptions'

export default class Compiler {
    public logger: Logger
    public assembler: Assembler
    public linker: Linker
    public fixer: Fixer

    constructor(logLevel: LogLevel = 'info') {
        this.logger = new Logger(logLevel)
        this.assembler = new Assembler(this.logger)
        this.linker = new Linker(this.logger)
        this.fixer = new Fixer(this.logger)
    }

    public async compile(files: AsmFile[], fileProvider: IFileProvider, options?: DeepPartial<ICompilerOptions>): Promise<CompilerContext> {
        const ctx = new CompilerContext(files, fileProvider, options)
        const diagnostics: Diagnostic[] = []

        ctx.assembles = []

        for (const file of ctx.files) {
            this.logger.log('compileInfo', `Compiling ${file.path}`)
            try {
                const asmCtx = await this.assembler.assemble(new AssemblerContext(this.assembler, ctx.options.assembler, new FileContext(file), fileProvider))
                ctx.assembles.push(asmCtx)

                const fileDiags = asmCtx.diagnostics
                diagnostics.push(...fileDiags)
                const fileErrorCount = fileDiags.filter((diag) => diag.type === 'error').length
                const fileWarnCount = fileDiags.filter((diag) => diag.type === 'warn').length

                this.logger.log('compileInfo', `Compilation of ${file.path} ${fileErrorCount ? 'failed' : 'finished'} with ${fileErrorCount} ${fileErrorCount === 1 ? 'error' : 'errors'} and ${fileWarnCount} ${fileWarnCount === 1 ? 'warning' : 'warnings'}`)
            } catch (err) {
                this.logger.log('compileCrash', `A fatal error occurred during compilation.\n${err.stack}`)
            }
        }

        this.logger.log('compileInfo', 'Linking')
        try {
            ctx.link = await this.linker.link(new LinkerContext(ctx.options.linker, ctx.assembles.map((asm) => asm.objectFile)))
            ctx.symbolFile = ctx.link.symbolFile
            ctx.romFile = ctx.link.romFile

            const linkDiags = ctx.link.diagnostics
            diagnostics.push(...linkDiags)
            const linkErrorCount = linkDiags.filter((diag) => diag.type === 'error').length
            const linkWarnCount = linkDiags.filter((diag) => diag.type === 'warn').length

            this.logger.log('compileInfo', `Linking ${linkErrorCount ? 'failed' : 'finished'} with ${linkErrorCount} ${linkErrorCount === 1 ? 'error' : 'errors'} and ${linkWarnCount} ${linkWarnCount === 1 ? 'warning' : 'warnings'}`)
        } catch (err) {
            this.logger.log('compileCrash', `A fatal error occurred during linking.\n${err.stack}`)
        }

        this.logger.log('compileInfo', 'Fixing ROM')
        try {
            ctx.fix = await this.fixer.fix(new FixerContext(ctx.options.fixer, ctx.romFile))
            ctx.romFile = ctx.fix.romFile
        } catch (err) {
            this.logger.log('compileCrash', `A fatal error occurred during ROM fixing.\n${err.stack}`)
        }

        this.logger.log('compileInfo', `Fixing ROM ${!ctx.fix || !ctx.fix.romFile ? 'failed' : 'finished'}`)

        for (const diag of diagnostics.filter((d) => d.type === 'info')) {
            this.logger.log('diagnosticInfo', diag.toString())
        }

        for (const diag of diagnostics.filter((d) => d.type === 'warn').slice(0, ctx.options.maxWarnings)) {
            this.logger.log('diagnosticWarn', diag.toString())
        }

        for (const diag of diagnostics.filter((d) => d.type === 'error').slice(0, ctx.options.maxErrors)) {
            this.logger.log('diagnosticError', diag.toString())
        }
        return ctx
    }
}
