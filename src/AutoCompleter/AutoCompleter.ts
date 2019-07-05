import FunctionRules from '../Evaluator/FunctionRules'
import KeywordRules from '../Evaluator/KeywordRules'
import OpRules from '../Evaluator/OpRules'
import PredefineRules from '../Evaluator/PredefineRules'
import RegionType from '../Linker/RegionType'
import Logger from '../Logger'
import AutoCompleterContext from './AutoCompleterContext'

export default class AutoCompleter {
    public logger: Logger

    constructor(logger: Logger) {
        this.logger = logger
    }

    public autoComplete(ctx: AutoCompleterContext): AutoCompleterContext {
        ctx.results = {}
        if (ctx.options.keywords) {
            ctx.results.keywords = {}
            for (const id of Object.keys(KeywordRules)) {
                ctx.results.keywords[id] = id.toUpperCase()
            }
        }
        if (!ctx.previous) {
            if (ctx.options.instructions) {
                ctx.results.instructions = OpRules
            }
            if (ctx.options.functions) {
                ctx.results.functions = FunctionRules
            }
            if (ctx.options.predefines) {
                ctx.results.predefines = {}
                ctx.results.predefines['@'] = '@'
                for (const id of Object.keys(PredefineRules)) {
                    ctx.results.predefines[id] = id
                }
            }
            if (ctx.options.regions) {
                ctx.results.regions = {}
                for (const id of Object.keys(RegionType)) {
                    if (parseInt(id, 10).toString() !== id) {
                        ctx.results.regions[id] = id.toLowerCase()
                    }
                }
            }
            if (ctx.options.numberEquates) {
                ctx.results.numberEquates = ctx.context.state.numberEquates
            }
            if (ctx.options.sets) {
                ctx.results.sets = ctx.context.state.sets
            }
            if (ctx.options.labels) {
                ctx.results.labels = ctx.context.state.labels
            }
            if (ctx.options.macros) {
                ctx.results.macros = ctx.context.state.macros
            }
        }
        if (ctx.options.stringEquates) {
            ctx.results.stringEquates = ctx.context.state.stringEquates
        }
        return ctx
    }

}
