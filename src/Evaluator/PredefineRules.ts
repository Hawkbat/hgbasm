import Node from '../Node'
import Evaluator from './Evaluator'
import EvaluatorContext from './EvaluatorContext'

type PredefineRule = (op: Node, ctx: EvaluatorContext, e: Evaluator) => number | string

const PredefineRules: { [key: string]: PredefineRule } = {
    _PI: () => Math.round(Math.PI * 65536),
    _RS: (_, ctx) => ctx.state.rsCounter ? ctx.state.rsCounter : 0,
    _NARG: (_, ctx) => {
        if (ctx.state.inMacroCalls && ctx.state.inMacroCalls.length) {
            return ctx.state.inMacroCalls[0].args.length - ctx.state.inMacroCalls[0].argOffset
        } else {
            return 0
        }
    },
    __LINE__: (_, ctx) => ctx.state.line,
    __FILE__: (_, ctx) => ctx.state.file,
    __DATE__: (_, ctx) => {
        const date = ctx.context.startDateTime
        const days = date.getDate().toString().padStart(2, '0')
        const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()]
        const year = date.getFullYear()
        return `${days} ${month} ${year}`
    },
    __TIME__: (_, ctx) => {
        const date = ctx.context.startDateTime
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')
        return `${hours}:${minutes}:${seconds}`
    },
    __ISO_8601_LOCAL__: (_, ctx) => {
        const date = ctx.context.startDateTime
        const pad = (n: number) => n < 10 ? `0${n}` : `${n}`
        const tz = date.getTimezoneOffset()
        let tzs = (tz > 0 ? '-' : '+') + pad(parseInt(`${Math.abs(tz / 60)}`, 10))
        if (tz % 60 !== 0) {
            tzs += pad(Math.abs(tz % 60))
        }
        if (tz === 0) {
            tzs = 'Z'
        }
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds()) + tzs}`
    },
    __ISO_8601_UTC__: (_, ctx) => `${ctx.context.startDateTime.toISOString()}`,
    __UTC_YEAR__: (_, ctx) => `${ctx.context.startDateTime.getUTCFullYear()}`,
    __UTC_MONTH__: (_, ctx) => `${ctx.context.startDateTime.getUTCMonth() + 1}`,
    __UTC_DAY__: (_, ctx) => `${ctx.context.startDateTime.getUTCDay() + 1}`,
    __UTC_HOUR__: (_, ctx) => `${ctx.context.startDateTime.getUTCHours()}`,
    __UTC_MINUTE__: (_, ctx) => `${ctx.context.startDateTime.getUTCMinutes()}`,
    __UTC_SECOND__: (_, ctx) => `${ctx.context.startDateTime.getUTCSeconds()}`,
    __RGBDS_MAJOR__: () => 0,
    __RGBDS_MINOR__: () => 3,
    __RGBDS_PATCH__: () => 7,
    __HGBASM_MAJOR__: (op, ctx, e) => e.isFeatureEnabled('version', op.token, ctx) ? ctx.context.options.version.major : 0,
    __HGBASM_MINOR__: (op, ctx, e) => e.isFeatureEnabled('version', op.token, ctx) ? ctx.context.options.version.minor : 0,
    __HGBASM_PATCH__: (op, ctx, e) => e.isFeatureEnabled('version', op.token, ctx) ? ctx.context.options.version.patch : 0,
    TRUE: (op, ctx, e) => e.isFeatureEnabled('bool_constants', op.token, ctx) ? 1 : 0,
    FALSE: (op, ctx, e) => e.isFeatureEnabled('bool_constants', op.token, ctx) ? 0 : 0,
    true: (op, ctx, e) => e.isFeatureEnabled('bool_constants', op.token, ctx) ? 1 : 0,
    false: (op, ctx, e) => e.isFeatureEnabled('bool_constants', op.token, ctx) ? 0 : 0
}

export default PredefineRules
