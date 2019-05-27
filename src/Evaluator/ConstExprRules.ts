import NodeType from '../NodeType'
import TokenType from '../TokenType'
import ConstExprRule from './ConstExprRule'
import FunctionRules from './FunctionRules'
import PredefineRules from './PredefineRules'

const regexpCache: { [key: string]: RegExp } = {}

function getCachedRegExp(key: string): RegExp {
    if (!regexpCache[key]) {
        regexpCache[key] = new RegExp(key, 'g')
    }
    regexpCache[key].lastIndex = 0
    return regexpCache[key]
}

const ConstExprRules: { [key: string]: ConstExprRule } = {
    '!': (op, ctx, e) => {
        if (op.children.length === 1) {
            return e.calcConstExpr(op.children[0], 'number', ctx) === 0 ? 1 : 0
        } else {
            e.error('Operation needs right argument', op.token, ctx)
            return 0
        }
    },
    '~': (op, ctx, e) => {
        if (op.children.length === 1) {
            return ~e.calcConstExpr(op.children[0], 'number', ctx)
        } else {
            e.error('Operation needs right argument', op.token, ctx)
            return 0
        }
    },
    '+': (op, ctx, e) => {
        if (op.children.length === 2) {
            return (e.calcConstExpr(op.children[0], 'number', ctx) + e.calcConstExpr(op.children[1], 'number', ctx)) | 0
        } else if (op.children.length === 1) {
            return e.calcConstExpr(op.children[0], 'number', ctx) | 0
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    '-': (op, ctx, e) => {
        if (op.children.length === 2) {
            if (ctx.state.labels && op.children[0].type === NodeType.identifier && op.children[1].type === NodeType.identifier) {
                const left = ctx.state.labels[op.children[0].token.value]
                const right = ctx.state.labels[op.children[1].token.value]
                if (left && right && left.section === right.section) {
                    return left.byteOffset - right.byteOffset
                }
            }
            return (e.calcConstExpr(op.children[0], 'number', ctx) - e.calcConstExpr(op.children[1], 'number', ctx)) | 0
        } else if (op.children.length === 1) {
            return -(e.calcConstExpr(op.children[0], 'number', ctx) | 0)
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    '*': (op, ctx, e) => {
        if (op.children.length === 2) {
            return (e.calcConstExpr(op.children[0], 'number', ctx) * e.calcConstExpr(op.children[1], 'number', ctx)) | 0
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    '/': (op, ctx, e) => {
        if (op.children.length === 2) {
            return (e.calcConstExpr(op.children[0], 'number', ctx) / e.calcConstExpr(op.children[1], 'number', ctx)) | 0
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    '%': (op, ctx, e) => {
        if (op.children.length === 2) {
            return (e.calcConstExpr(op.children[0], 'number', ctx) % e.calcConstExpr(op.children[1], 'number', ctx)) | 0
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    '<<': (op, ctx, e) => {
        if (op.children.length === 2) {
            return e.calcConstExpr(op.children[0], 'number', ctx) << e.calcConstExpr(op.children[1], 'number', ctx)
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    '>>': (op, ctx, e) => {
        if (op.children.length === 2) {
            return e.calcConstExpr(op.children[0], 'number', ctx) >>> e.calcConstExpr(op.children[1], 'number', ctx)
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    '&': (op, ctx, e) => {
        if (op.children.length === 2) {
            return e.calcConstExpr(op.children[0], 'number', ctx) & e.calcConstExpr(op.children[1], 'number', ctx)
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    '|': (op, ctx, e) => {
        if (op.children.length === 2) {
            return e.calcConstExpr(op.children[0], 'number', ctx) | e.calcConstExpr(op.children[1], 'number', ctx)
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    '^': (op, ctx, e) => {
        if (op.children.length === 2) {
            return e.calcConstExpr(op.children[0], 'number', ctx) ^ e.calcConstExpr(op.children[1], 'number', ctx)
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    '&&': (op, ctx, e) => {
        if (op.children.length === 2) {
            const a = e.calcConstExpr(op.children[0], 'number', ctx)
            const b = e.calcConstExpr(op.children[1], 'number', ctx)
            return (a !== 0 && b !== 0) ? 1 : 0
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    '||': (op, ctx, e) => {
        if (op.children.length === 2) {
            const a = e.calcConstExpr(op.children[0], 'number', ctx)
            const b = e.calcConstExpr(op.children[1], 'number', ctx)
            return (a !== 0 || b !== 0) ? 1 : 0
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    '==': (op, ctx, e) => {
        if (op.children.length === 2) {
            const a = e.calcConstExpr(op.children[0], 'either', ctx)
            const b = e.calcConstExpr(op.children[1], 'either', ctx)
            return (a === b) ? 1 : 0
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    '!=': (op, ctx, e) => {
        if (op.children.length === 2) {
            const a = e.calcConstExpr(op.children[0], 'either', ctx)
            const b = e.calcConstExpr(op.children[1], 'either', ctx)
            return (a !== b) ? 1 : 0
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    '<=': (op, ctx, e) => {
        if (op.children.length === 2) {
            const a = e.calcConstExpr(op.children[0], 'number', ctx)
            const b = e.calcConstExpr(op.children[1], 'number', ctx)
            return (a <= b) ? 1 : 0
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    '>=': (op, ctx, e) => {
        if (op.children.length === 2) {
            const a = e.calcConstExpr(op.children[0], 'number', ctx)
            const b = e.calcConstExpr(op.children[1], 'number', ctx)
            return (a >= b) ? 1 : 0
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    '<': (op, ctx, e) => {
        if (op.children.length === 2) {
            const a = e.calcConstExpr(op.children[0], 'number', ctx)
            const b = e.calcConstExpr(op.children[1], 'number', ctx)
            return (a < b) ? 1 : 0
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    '>': (op, ctx, e) => {
        if (op.children.length === 2) {
            const a = e.calcConstExpr(op.children[0], 'number', ctx)
            const b = e.calcConstExpr(op.children[1], 'number', ctx)
            return (a > b) ? 1 : 0
        } else {
            e.error('Operation needs both left and right arguments', op.token, ctx)
            return 0
        }
    },
    [NodeType.string]: (op, ctx, e) => {
        let source = op.token.value

        if (op.token.type === TokenType.macro_argument) {
            source = source.trim()
        }
        if (op.token.type === TokenType.string && source.startsWith('"') && source.endsWith('"')) {
            source = source.substring(1, source.length - 1)
        }
        if (source.indexOf('\\') >= 0 || source.indexOf('{') >= 0) {
            source = source.replace(getCachedRegExp('(?<!\\\\)\\\\"'), '"')
            source = source.replace(getCachedRegExp('(?<!\\\\)\\\\,'), ',')
            source = source.replace(getCachedRegExp('(?<!\\\\)\\\\{'), '{')
            source = source.replace(getCachedRegExp('(?<!\\\\)\\\\}'), '}')
            source = source.replace(getCachedRegExp('(?<!\\\\)\\\\n'), '\n')
            source = source.replace(getCachedRegExp('(?<!\\\\)\\\\t'), '\t')

            let anyReplaced = true
            while (anyReplaced) {
                anyReplaced = false
                for (const key of Object.keys(PredefineRules)) {
                    if (source.indexOf(key) === -1) {
                        continue
                    }
                    const val = PredefineRules[key](op, ctx, e)
                    const value = typeof val === 'string' ? val : `$${val.toString(16).toUpperCase()}`
                    const regex = getCachedRegExp(`\\{${key}\\}`)
                    const newSource = e.applySourceReplace(source, regex, value)
                    if (source !== newSource) {
                        source = newSource
                        anyReplaced = true
                    }
                }
                if (ctx.state.sets) {
                    for (const key of Object.keys(ctx.state.sets)) {
                        if (source.indexOf(key) === -1) {
                            continue
                        }
                        const value = `$${ctx.state.sets[key].value.toString(16).toUpperCase()}`
                        const regex = getCachedRegExp(`\\{${key}\\}`)
                        const newSource = e.applySourceReplace(source, regex, value)
                        if (source !== newSource) {
                            source = newSource
                            anyReplaced = true
                        }
                    }
                }
                if (ctx.state.numberEquates) {
                    for (const key of Object.keys(ctx.state.numberEquates)) {
                        if (source.indexOf(key) === -1) {
                            continue
                        }
                        const value = `$${ctx.state.numberEquates[key].value.toString(16).toUpperCase()}`
                        const regex = getCachedRegExp(`\\{${key}\\}`)
                        const newSource = e.applySourceReplace(source, regex, value)
                        if (source !== newSource) {
                            source = newSource
                            anyReplaced = true
                        }
                    }
                }
                if (ctx.state.stringEquates) {
                    for (const key of Object.keys(ctx.state.stringEquates)) {
                        if (source.indexOf(key) === -1) {
                            continue
                        }
                        const value = ctx.state.stringEquates[key].value
                        const regex = getCachedRegExp(`\\{${key}\\}`)
                        const newSource = e.applySourceReplace(source, regex, value)
                        if (source !== newSource) {
                            source = newSource
                            anyReplaced = true
                        }
                    }
                }
                if (ctx.state.inMacroCalls && ctx.state.inMacroCalls.length) {
                    const macroCall = ctx.state.inMacroCalls[0]
                    for (let key = 1; key < 10; key++) {
                        if (source.indexOf(`\\${key}`) === -1) {
                            continue
                        }
                        const offset = key - 1 + macroCall.argOffset
                        const value = macroCall.args[offset] ? macroCall.args[offset] : ''
                        const regex = getCachedRegExp(`\\\\${key}`)
                        const newSource = e.applySourceReplace(source, regex, value)
                        if (source !== newSource) {
                            source = newSource
                            anyReplaced = true
                        }
                    }
                }
                if (ctx.state.macroCounter !== undefined) {
                    if (source.indexOf('\\@') >= 0) {
                        const value = `_${ctx.state.macroCounter}`
                        const regex = getCachedRegExp(`\\\\@`)
                        const newSource = e.applySourceReplace(source, regex, value)
                        if (source !== newSource) {
                            source = newSource
                            anyReplaced = true
                        }
                    }
                }
            }
        }
        if (source !== op.token.value) {
            e.logger.log('stringExpansion', 'String expansion of', op.token.value, 'to', source, '\n')
        }
        return source
    },
    [NodeType.function_call]: (op, ctx, e) => {
        const func = FunctionRules[op.children[0].token.value.toLowerCase()]
        if (!func) {
            e.error('Unknown function name', op.children[0].token, ctx)
            return 0
        }
        return func.rule(op, ctx, e)
    },
    [NodeType.indexer]: (op, ctx, e) => {
        return e.calcConstExpr(op.children[0], 'number', ctx)
    },
    [NodeType.identifier]: (op, ctx, e) => {
        const id = op.token.value.startsWith('.') ? ctx.state.inLabel + op.token.value : op.token.value
        if (PredefineRules[id]) {
            return PredefineRules[id](op, ctx, e)
        }
        if (ctx.state.numberEquates && ctx.state.numberEquates.hasOwnProperty(id)) {
            return ctx.state.numberEquates[id].value
        } else if (ctx.state.stringEquates && ctx.state.stringEquates.hasOwnProperty(id)) {
            return ctx.state.stringEquates[id].value
        } else if (ctx.state.sets && ctx.state.sets.hasOwnProperty(id)) {
            return ctx.state.sets[id].value
        } else if (ctx.state.labels && ctx.state.labels.hasOwnProperty(id)) {
            e.error('Labels cannot be used in constant expressions', op.token, ctx)
            return 0
        } else {
            e.error('No matching symbol defined', op.token, ctx)
            return 0
        }
    },
    [NodeType.number_literal]: (op, ctx, e) => {
        switch (op.token.type) {
            case TokenType.fixed_point_number: {
                const bits = op.token.value.split('.')
                const high = parseInt(bits[0], 10)
                const low = parseInt(bits[1], 10)
                return (high << 16) | low
            }
            case TokenType.decimal_number: {
                return parseInt(op.token.value, 10)
            }
            case TokenType.hex_number: {
                return parseInt(op.token.value.substr(1), 16)
            }
            case TokenType.binary_number: {
                return parseInt(op.token.value.substr(1), 2)
            }
            case TokenType.octal_number: {
                return parseInt(op.token.value.substr(1), 8)
            }
        }
        e.error('Invalid number format', op.token, ctx)
        return 0
    }
}

export default ConstExprRules
