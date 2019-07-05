import Diagnostic from '../Diagnostic'
import Evaluator from '../Evaluator/Evaluator'
import EvaluatorContext from '../Evaluator/EvaluatorContext'
import Lexer from '../Lexer/Lexer'
import LexerContext from '../Lexer/LexerContext'
import RegionType from '../Linker/RegionType'
import SymbolType from '../Linker/SymbolType'
import Logger from '../Logger'
import Parser from '../Parser/Parser'
import ParserContext from '../Parser/ParserContext'
import Token from '../Token'
import AssemblerContext from './AssemblerContext'
import FileContext from './FileContext'
import LineContext from './LineContext'

export default class Assembler {
    public logger: Logger
    public lexer: Lexer
    public parser: Parser
    public evaluator: Evaluator

    constructor(logger: Logger) {
        this.logger = logger
        this.lexer = new Lexer(this.logger)
        this.parser = new Parser(this.logger)
        this.evaluator = new Evaluator(this.logger)
    }

    public async assemble(ctx: AssemblerContext): Promise<AssemblerContext> {
        await this.assembleNestedFile(ctx, ctx.rootFile)
        await this.buildObjectFile(ctx)
        return ctx
    }

    public async assembleNestedFile(ctx: AssemblerContext, file: FileContext): Promise<void> {
        for (let i = file.startLine; i <= file.endLine; i++) {
            const line = file.lines[i]

            ctx.state.file = line.file.source.path
            ctx.state.line = line.lineNumber

            this.logger.logLine('lineSource', `${line.file.source.path} (${i})`, line.source.text)

            await this.lexer.lex(new LexerContext(ctx, line))
            await this.parser.parse(new ParserContext(ctx, line))
            await this.evaluator.evaluate(new EvaluatorContext(ctx, line))

            if (ctx.diagnostics.some((diag) => diag.type === 'error')) {
                if (line.lex && line.lex.tokens) {
                    for (const token of line.lex.tokens) {
                        this.logger.logLine('tokenStream', token.toString())
                    }
                }
                if (line.parse && line.parse.node) {
                    this.logger.logLine('lineNode', line.parse.node.toString())
                }
                if (line.eval) {
                    this.logger.logLine('lineState', JSON.stringify(ctx.state, null, 4))
                }
                break
            }
        }
    }

    public async buildObjectFile(ctx: AssemblerContext): Promise<void> {
        const sectionKeys = ctx.state.sections ? Object.keys(ctx.state.sections) : []
        if (ctx.state.labels) {
            for (const v of Object.values(ctx.state.labels)) {
                const symbol = ctx.objectFile.symbols.find((s) => s.name === v.id)
                if (symbol) {
                    symbol.name = v.id
                    symbol.file = v.file
                    symbol.line = v.startLine
                    symbol.type = v.exported ? SymbolType.Exported : SymbolType.Internal
                    symbol.sectionId = sectionKeys.indexOf(v.section)
                    symbol.value = v.byteOffset
                } else {
                    ctx.objectFile.symbols.push({
                        id: ctx.objectFile.symbols.length,
                        name: v.id,
                        file: v.file,
                        line: v.startLine,
                        type: v.exported ? SymbolType.Exported : SymbolType.Internal,
                        sectionId: sectionKeys.indexOf(v.section),
                        value: v.byteOffset
                    })
                }
            }
        }
        if (ctx.state.sections) {
            for (const key of sectionKeys) {
                const v = ctx.state.sections[key]
                ctx.objectFile.sections.push({
                    id: ctx.objectFile.sections.length,
                    name: v.id,
                    size: v.bytes.length,
                    region: RegionType[v.region as keyof typeof RegionType],
                    address: v.fixedAddress ? v.fixedAddress : -1,
                    bank: v.bank ? v.bank : -1,
                    align: v.alignment ? v.alignment : -1,
                    data: v.region === 'rom0' || v.region === 'romx' ? v.bytes : [],
                    patches: ctx.patches.filter((p) => p.section === v.id).map((p) => ({
                        file: p.file,
                        line: p.line,
                        offset: p.offset,
                        type: p.type,
                        expr: p.expr
                    }))
                })
            }
        }
    }

    public error(msg: string, token: Token | undefined, line: LineContext | undefined, ctx: AssemblerContext): void {
        ctx.diagnostics.push(new Diagnostic('Assembler', msg, 'error', token, line))
    }
}
