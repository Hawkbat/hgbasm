import TokenType from '../TokenType'
import TokenReplacementRule from './TokenReplacementRule'

const TokenReplacementRules: { [key: number]: TokenReplacementRule } = {
    [TokenType.identifier]: (token, inType, ctx, lex) => {
        if (ctx.state.inMacroDefines && ctx.state.inMacroDefines.length) {
            return
        }
        if (inType === undefined) {
            let value = token.value
            while (value.endsWith(':')) {
                value = value.substr(0, value.length - 1)
            }

            const isStringEquate =
                ctx.state.stringEquates &&
                ctx.state.stringEquates[value] &&
                !ctx.tokens.some((t) =>
                    (t.type === TokenType.keyword && t.value.toLowerCase() === 'purge') ||
                    (t.type === TokenType.function && t.value.toLowerCase() === 'def'))

            const isMacroCall =
                token.col > 0 &&
                !ctx.tokens.some((t) =>
                    t.type === TokenType.keyword ||
                    t.type === TokenType.opcode ||
                    t.type === TokenType.operator)

            if (isStringEquate && ctx.state.stringEquates) {
                lex.substituteToken(token, ctx.state.stringEquates[value].value, ctx)
            } else if (isMacroCall) {
                token.type = TokenType.macro_call
                ctx.inType = TokenType.macro_call
            }
        }
    },
    [TokenType.string_interpolation]: (token, inType, ctx, lex) => {
        if (ctx.state.inMacroDefines && ctx.state.inMacroDefines.length) {
            return
        }
        if (inType === undefined) {
            const value = token.value.substr(1, token.value.length - 2)

            if (ctx.state.sets && ctx.state.sets[value]) {
                lex.substituteToken(token, `$${ctx.state.sets[value].value.toString(16).toUpperCase()}`, ctx)
            } else if (ctx.state.numberEquates && ctx.state.numberEquates[value]) {
                lex.substituteToken(token, `$${ctx.state.numberEquates[value].value.toString(16).toUpperCase()}`, ctx)
            } else if (ctx.state.stringEquates && ctx.state.stringEquates[value]) {
                lex.substituteToken(token, ctx.state.stringEquates[value].value, ctx)
            } else {
                lex.error('No matching symbol found to expand', token, ctx)
            }
        }
    },
    [TokenType.macro_escape]: (token, inType, ctx, lex) => {
        if (ctx.state.inMacroDefines && ctx.state.inMacroDefines.length) {
            return
        }
        if (inType === undefined) {
            if (ctx.state.inMacroCalls && ctx.state.inMacroCalls.length) {
                if (token.value === '\\@') {
                    lex.substituteToken(token, `_${ctx.state.macroCounter}`, ctx)
                } else {
                    const macroCall = ctx.state.inMacroCalls[0]
                    const index = parseInt(token.value.substr(1), 10) + macroCall.argOffset
                    if (index <= macroCall.args.length) {
                        lex.substituteToken(token, macroCall.args[index - 1], ctx)
                    } else {
                        lex.error('Macro argument was not provided when macro was called', token, ctx)
                    }
                }
            } else {
                lex.error('Macro arguments can only be accessed within macro calls', token, ctx)
            }
        }
    }
}

export default TokenReplacementRules
