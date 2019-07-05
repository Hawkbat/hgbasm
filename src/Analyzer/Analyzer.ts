import Logger from '../Logger'
import AnalyzerContext from './AnalyzerContext'

export default class Analyzer {
    public logger: Logger

    constructor(logger: Logger) {
        this.logger = logger
    }

    public analyze(ctx: AnalyzerContext): AnalyzerContext {
        ctx.results = {
            sectionSizes: [],
            labelOffsets: [],
            labelSizes: []
        }
        const s = ctx.context.state

        if (ctx.options.sectionSizes !== 'none' && s.sections) {
            for (const id of Object.keys(s.sections)) {
                ctx.results.sectionSizes.push({
                    symbol: s.sections[id],
                    display: ctx.options.sectionSizes,
                    value: s.sections[id].bytes.length
                })
            }
        }
        if (ctx.options.globalLabelOffsets !== 'none' && s.labels) {
            for (const id of Object.keys(s.labels)) {
                if (id.includes('.')) {
                    continue
                }
                ctx.results.labelOffsets.push({
                    symbol: s.labels[id],
                    display: ctx.options.globalLabelOffsets,
                    value: s.labels[id].byteOffset
                })
            }
        }
        if (ctx.options.globalLabelSizes !== 'none' && s.labels) {
            for (const id of Object.keys(s.labels)) {
                if (id.includes('.')) {
                    continue
                }
                ctx.results.labelSizes.push({
                    symbol: s.labels[id],
                    display: ctx.options.globalLabelSizes,
                    value: s.labels[id].byteSize
                })
            }
        }
        if (ctx.options.localLabelOffsets !== 'none' && s.labels) {
            for (const id of Object.keys(s.labels)) {
                if (!id.includes('.')) {
                    continue
                }
                ctx.results.labelOffsets.push({
                    symbol: s.labels[id],
                    display: ctx.options.localLabelOffsets,
                    value: s.labels[id].byteOffset
                })
            }
        }
        if (ctx.options.localLabelSizes !== 'none' && s.labels) {
            for (const id of Object.keys(s.labels)) {
                if (!id.includes('.')) {
                    continue
                }
                ctx.results.labelSizes.push({
                    symbol: s.labels[id],
                    display: ctx.options.localLabelSizes,
                    value: s.labels[id].byteSize
                })
            }
        }
        return ctx
    }
}
