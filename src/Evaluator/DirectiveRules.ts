import AssemblerMode from '../Assembler/AssemblerMode'
import DirectiveRule from './DirectiveRule'

const DirectiveRules: { [key: string]: DirectiveRule } = {
    mode: (ctx, args, e) => {
        if (args.length !== 1) {
            e.error('Directive expects exactly one argument', undefined, ctx)
            return
        }
        const mode = args[0] as AssemblerMode
        if (!Object.values(AssemblerMode).some((v) => v === mode)) {
            e.error('Unsupported mode provided', undefined, ctx)
        }
        ctx.context.mode = mode
    }
}

export default DirectiveRules
