import TokenType from '../TokenType'
import TokenReplacementRule from './TokenReplacementRule'

const TokenReplacementRules: { [key: number]: TokenReplacementRule } = {
    [TokenType.identifier]: (token, inType, state, ctx, lex) => {
        if (state.inMacroDefines && state.inMacroDefines.length) {
            return
        }
        if (inType === undefined) {
            let value = token.value
            while (value.endsWith(':')) {
                value = value.substr(0, value.length - 1)
            }

            const isStringEquate =
                state.stringEquates &&
                state.stringEquates[value] &&
                !ctx.tokens.some((t) =>
                    (t.type === TokenType.keyword && t.value.toLowerCase() === 'purge') ||
                    (t.type === TokenType.function && t.value.toLowerCase() === 'def'))

            const isMacroCall =
                token.col > 0 &&
                !ctx.tokens.some((t) =>
                    t.type === TokenType.keyword ||
                    t.type === TokenType.opcode ||
                    t.type === TokenType.operator)

            if (isStringEquate && state.stringEquates) {
                lex.substituteToken(token, state.stringEquates[value].value, ctx)
            } else if (isMacroCall) {
                token.type = TokenType.macro_call
                ctx.inType = TokenType.macro_call
            }
        }
    },
    [TokenType.string_interpolation]: (token, inType, state, ctx, lex) => {
        if (state.inMacroDefines && state.inMacroDefines.length) {
            return
        }
        if (inType === undefined) {
            const value = token.value.substr(1, token.value.length - 2)

            if (state.sets && state.sets[value]) {
                lex.substituteToken(token, `$${state.sets[value].value.toString(16).toUpperCase()}`, ctx)
            } else if (state.numberEquates && state.numberEquates[value]) {
                lex.substituteToken(token, `$${state.numberEquates[value].value.toString(16).toUpperCase()}`, ctx)
            } else if (state.stringEquates && state.stringEquates[value]) {
                lex.substituteToken(token, state.stringEquates[value].value, ctx)
            } else {
                lex.error('No matching symbol found to expand', token, ctx)
            }
        }
    },
    [TokenType.macro_escape]: (token, inType, state, ctx, lex) => {
        if (state.inMacroDefines && state.inMacroDefines.length) {
            return
        }
        if (inType === undefined) {
            if (state.inMacroCalls && state.inMacroCalls.length) {
                if (token.value === '\\@') {
                    lex.substituteToken(token, `_${state.macroCounter}`, ctx)
                } else {
                    const macroCall = state.inMacroCalls[0]
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
