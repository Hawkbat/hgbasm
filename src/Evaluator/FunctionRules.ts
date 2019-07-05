import IFunctionRule from './IFunctionRule'

const FunctionRules: { [key: string]: IFunctionRule } = {
    div: {
        params: [
            { name: 'a', type: 'number', desc: 'The dividend' },
            { name: 'b', type: 'number', desc: 'The divisor' }
        ],
        return: { type: 'number', desc: 'The resulting number' },
        desc: 'Performs fixed-point division',
        rule: (op, ctx, e) => {
            if (op.children.length === 3) {
                const a = e.calcConstExpr(op.children[1], 'number', ctx) / 65536
                const b = e.calcConstExpr(op.children[2], 'number', ctx) / 65536
                return Math.floor((a / b) * 65536)
            } else {
                e.error('Function needs exactly two arguments', op.children[0].token, ctx)
                return 0
            }
        }
    },
    mul: {
        params: [
            { name: 'a', type: 'number', desc: 'The first multiplicand' },
            { name: 'b', type: 'number', desc: 'The second multiplicand' }
        ],
        return: { type: 'number', desc: 'The resulting number' },
        desc: 'Performs fixed-point multiplication',
        rule: (op, ctx, e) => {
            if (op.children.length === 3) {
                const a = e.calcConstExpr(op.children[1], 'number', ctx) / 65536
                const b = e.calcConstExpr(op.children[2], 'number', ctx) / 65536
                return Math.floor((a * b) * 65536)
            } else {
                e.error('Function needs exactly two arguments', op.children[0].token, ctx)
                return 0
            }
        }
    },
    sin: {
        params: [
            { name: 'angle', type: 'number', desc: 'The angle, where 65536.0 is a full circle' }
        ],
        return: { type: 'number', desc: 'The result, between -1.0 and 1.0' },
        desc: 'Calculates fixed-point sine',
        rule: (op, ctx, e) => {
            if (op.children.length === 2) {
                const n = e.calcConstExpr(op.children[1], 'number', ctx) / 65536
                return Math.floor(Math.sin(n / 65536 * Math.PI * 2.0) * 65536)
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        }
    },
    cos: {
        params: [
            { name: 'angle', type: 'number', desc: 'The angle, where 65536.0 is a full circle' }
        ],
        return: { type: 'number', desc: 'The result, between -1.0 and 1.0' },
        desc: 'Calculates fixed-point cosine',
        rule: (op, ctx, e) => {
            if (op.children.length === 2) {
                const n = e.calcConstExpr(op.children[1], 'number', ctx) / 65536
                return Math.floor(Math.cos(n / 65536 * Math.PI * 2.0) * 65536)
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        }
    },
    tan: {
        params: [
            { name: 'angle', type: 'number', desc: 'The angle, where 65536.0 is a full circle' }
        ],
        return: { type: 'number', desc: 'The result, between -1.0 and 1.0' },
        desc: 'Calculates fixed-point tangent',
        rule: (op, ctx, e) => {
            if (op.children.length === 2) {
                const n = e.calcConstExpr(op.children[1], 'number', ctx) / 65536
                return Math.floor(Math.tan(n / 65536 * Math.PI * 2.0) * 65536)
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        }
    },
    asin: {
        params: [
            { name: 'ratio', type: 'number', desc: 'The ratio, between -1.0 and 1.0' }
        ],
        return: { type: 'number', desc: 'The angle, where 65536.0 is a full circle' },
        desc: 'Calculates fixed-point arcsine',
        rule: (op, ctx, e) => {
            if (op.children.length === 2) {
                const n = e.calcConstExpr(op.children[1], 'number', ctx) / 65536
                return Math.floor(Math.asin(n) * 65536)
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        }
    },
    acos: {
        params: [
            { name: 'ratio', type: 'number', desc: 'The ratio, between -1.0 and 1.0' }
        ],
        return: { type: 'number', desc: 'The angle, where 65536.0 is a full circle' },
        desc: 'Calculates fixed-point arccosine',
        rule: (op, ctx, e) => {
            if (op.children.length === 2) {
                const n = e.calcConstExpr(op.children[1], 'number', ctx) / 65536
                return Math.floor(Math.acos(n) * 65536)
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        }
    },
    atan: {
        params: [
            { name: 'ratio', type: 'number', desc: 'The ratio, between -1.0 and 1.0' }
        ],
        return: { type: 'number', desc: 'The angle, where 65536.0 is a full circle' },
        desc: 'Calculates fixed-point arctangent',
        rule: (op, ctx, e) => {
            if (op.children.length === 2) {
                const n = e.calcConstExpr(op.children[1], 'number', ctx) / 65536
                return Math.floor(Math.atan(n) * 65536)
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        }
    },
    atan2: {
        params: [
            { name: 'x', type: 'number', desc: 'The horizontal coordinate, between -1.0 and 1.0' },
            { name: 'y', type: 'number', desc: 'The vertical coordinate' }
        ],
        return: { type: 'number', desc: 'The angle, where 65536.0 is a full circle' },
        desc: 'Calculates the fixed-point angle between (1, 0) and (x, y)',
        rule: (op, ctx, e) => {
            if (op.children.length === 3) {
                const a = e.calcConstExpr(op.children[1], 'number', ctx) / 65536
                const b = e.calcConstExpr(op.children[2], 'number', ctx) / 65536
                return Math.floor(Math.atan2(b, a) * 65536)
            } else {
                e.error('Function needs exactly two arguments', op.children[0].token, ctx)
                return 0
            }
        }
    },
    strlen: {
        params: [
            { name: 'str', type: 'string', desc: 'The string' }
        ],
        return: { type: 'number', desc: 'The length of the string' },
        desc: 'Calculates the number of characters in a string',
        rule: (op, ctx, e) => {
            if (op.children.length === 2) {
                return e.calcConstExpr(op.children[1], 'string', ctx).length
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        }
    },
    strcat: {
        params: [
            { name: 'a', type: 'string', desc: 'The first string' },
            { name: 'b', type: 'string', desc: 'The second string' }
        ],
        return: { type: 'string', desc: 'The resulting string' },
        desc: 'Calculates the concatenation of two strings',
        rule: (op, ctx, e) => {
            if (op.children.length === 3) {
                const a = e.calcConstExpr(op.children[1], 'string', ctx)
                const b = e.calcConstExpr(op.children[2], 'string', ctx)
                return a + b
            } else {
                e.error('Function needs exactly two arguments', op.children[0].token, ctx)
                return ''
            }
        }
    },
    strcmp: {
        params: [
            { name: 'a', type: 'string', desc: 'The first string' },
            { name: 'b', type: 'string', desc: 'The second string' }
        ],
        return: { type: 'number', desc: '-1 if b before a, 0 if b equals a, 1 if b after a' },
        desc: 'Calculates the sorting order of two strings',
        rule: (op, ctx, e) => {
            if (op.children.length === 3) {
                const a = e.calcConstExpr(op.children[1], 'string', ctx)
                const b = e.calcConstExpr(op.children[2], 'string', ctx)
                return a.localeCompare(b)
            } else {
                e.error('Function needs exactly two arguments', op.children[0].token, ctx)
                return 0
            }
        }
    },
    strin: {
        params: [
            { name: 'str', type: 'string', desc: 'The string to search in' },
            { name: 'pattern', type: 'string', desc: 'The string to search for' }
        ],
        return: { type: 'number', desc: 'The position within the string (starting at 1), or 0 if not found' },
        desc: 'Calculates the position of a string within another string',
        rule: (op, ctx, e) => {
            if (op.children.length === 3) {
                const a = e.calcConstExpr(op.children[1], 'string', ctx)
                const b = e.calcConstExpr(op.children[2], 'string', ctx)
                return a.indexOf(b) + 1
            } else {
                e.error('Function needs exactly two arguments', op.children[0].token, ctx)
                return 0
            }
        }
    },
    strsub: {
        params: [
            { name: 'str', type: 'string', desc: 'The string to slice' },
            { name: 'pos', type: 'number', desc: 'The position within the string (starting at 1)' },
            { name: 'len', type: 'number', desc: 'The desired length of the substring' }
        ],
        return: { type: 'string', desc: 'The resulting string' },
        desc: 'Calculates a substring of a string',
        rule: (op, ctx, e) => {
            if (op.children.length === 4) {
                const a = e.calcConstExpr(op.children[1], 'string', ctx)
                const b = e.calcConstExpr(op.children[2], 'number', ctx)
                const c = e.calcConstExpr(op.children[3], 'number', ctx)
                return a.substr(b - 1, c)
            } else {
                e.error('Function needs exactly two arguments', op.children[0].token, ctx)
                return ''
            }
        }
    },
    strupr: {
        params: [
            { name: 'str', type: 'string', desc: 'The string' }
        ],
        return: { type: 'string', desc: 'The resulting string' },
        desc: 'Calculates an all-upper-case version of a string',
        rule: (op, ctx, e) => {
            if (op.children.length === 2) {
                return e.calcConstExpr(op.children[1], 'string', ctx).toUpperCase()
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return ''
            }
        }
    },
    strlwr: {
        params: [
            { name: 'str', type: 'string', desc: 'The string' }
        ],
        return: { type: 'string', desc: 'The resulting string' },
        desc: 'Calculates an all-lower-case version of a string',
        rule: (op, ctx, e) => {
            if (op.children.length === 2) {
                return e.calcConstExpr(op.children[1], 'string', ctx).toLowerCase()
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return ''
            }
        }
    },
    bank: {
        params: [
            { name: 'arg', type: 'varies', desc: '"@", a label, or a section name' }
        ],
        return: { type: 'number', desc: 'The bank number' },
        desc: 'Calculates the bank of the current section (@), a specified section, or a label',
        rule: (op, ctx, e) => {
            const state = ctx.context.state
            const id = `${op.children[1].token.value.startsWith('.') ? state.inGlobalLabel + op.children[1].token.value : op.children[1].token.value}__BANK`
            if (state.numberEquates && state.numberEquates.hasOwnProperty(id)) {
                return state.numberEquates[id].value
            } else {
                e.error('Bank is not known or no matching symbol', op.children[1].token, ctx)
                return 0
            }
        }
    },
    def: {
        params: [
            { name: 'arg', type: 'symbol', desc: 'A symbol' }
        ],
        return: { type: 'number', desc: '1 if symbol is defined, 0 if it is not' },
        desc: 'Checks if a symbol (label, equate, macro, etc.) has been defined',
        rule: (op, ctx, e) => {
            const state = ctx.context.state
            if (op.children.length === 2) {
                const id = op.children[1].token.value
                if (state.labels && state.labels[id]) {
                    return 1
                }
                if (state.numberEquates && state.numberEquates[id]) {
                    return 1
                }
                if (state.stringEquates && state.stringEquates[id]) {
                    return 1
                }
                if (state.sets && state.sets[id]) {
                    return 1
                }
                if (state.macros && state.macros[id]) {
                    return 1
                }
                return 0
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        }
    },
    high: {
        params: [
            { name: 'arg', type: 'varies', desc: 'A label, number, or 16-bit register' }
        ],
        return: { type: 'number', desc: 'The resulting 8-bit value or register' },
        desc: 'Calculates the upper 8 bits of a label or number, or the top half of a 16-bit register',
        rule: (op, ctx, e) => {
            if (op.children.length === 2) {
                return (e.calcConstExpr(op.children[1], 'number', ctx) & 0xFF00) >>> 8
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        }
    },
    low: {
        params: [
            { name: 'arg', type: 'varies', desc: 'A label, number, or 16-bit register' }
        ],
        return: { type: 'number', desc: 'The resulting 8-bit value or register' },
        desc: 'Calculates the lower 8 bits of a label or number, or the bottom half of a 16-bit register',
        rule: (op, ctx, e) => {
            if (op.children.length === 2) {
                return (e.calcConstExpr(op.children[1], 'number', ctx) & 0x00FF) >>> 0
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        }
    },
    sizeof: {
        params: [
            { name: 'arg', type: 'varies', desc: '"@", a section name, a label, a number, or a register' }
        ],
        return: { type: 'number', desc: 'The resulting size, in bytes' },
        desc: 'Calculates the size of a register, the size of the current section (@), the size of a specified section, the number of bytes between a global label and the next global label, the number of bytes between a local label and the next local or global label, or the number of bytes needed to hold a number value',
        rule: (op, ctx, e) => {
            if (!e.isFeatureEnabled('sizeof', op.token, ctx)) {
                return 0
            }
            if (op.children.length === 2) {
                const val = op.children[1].token.value.toLowerCase()
                if (val === 'a' || val === 'b' || val === 'c' || val === 'd' || val === 'e' || val === 'f' || val === 'h' || val === 'l') {
                    return 1
                } else if (val === 'af' || val === 'bc' || val === 'de' || val === 'hl' || val === 'sp') {
                    return 2
                }
                const num = e.calcConstExpr(op.children[1], 'number', ctx)
                if (num >= -0x80 && num <= 0xFF) {
                    return 1
                }
                if (num >= -0x8000 && num <= 0xFFFF) {
                    return 2
                }
                if (num >= -0x80000000 && num <= 0xFFFFFFFF) {
                    return 4
                }
                return 8
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        }
    },
    int: {
        params: [
            { name: 'str', type: 'string', desc: 'The string to convert, with appropriate prefix for base' }
        ],
        return: { type: 'number', desc: 'The resulting number' },
        desc: 'Converts a string to an integer',
        rule: (op, ctx, e) => {
            if (!e.isFeatureEnabled('conversion_functions', op.token, ctx)) {
                return 0
            }
            if (op.children.length === 2) {
                const str = e.calcConstExpr(op.children[1], 'string', ctx)
                if (str.startsWith('$')) {
                    return parseInt(str.substr(1), 16)
                }
                if (str.startsWith('&')) {
                    return parseInt(str.substr(1), 8)
                }
                if (str.startsWith('%')) {
                    return parseInt(str.substr(1), 2)
                }
                return parseInt(str, 10)
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        }
    },
    dec: {
        params: [
            { name: 'num', type: 'number', desc: 'The number to convert' }
        ],
        return: { type: 'string', desc: 'The resulting string' },
        desc: 'Converts an integer to its decimal string represenntation',
        rule: (op, ctx, e) => {
            if (!e.isFeatureEnabled('conversion_functions', op.token, ctx)) {
                return ''
            }
            if (op.children.length === 2) {
                return `${e.calcConstExpr(op.children[1], 'number', ctx).toString(10)}`
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return ''
            }
        }
    },
    hex: {
        params: [
            { name: 'num', type: 'number', desc: 'The number to convert' }
        ],
        return: { type: 'string', desc: 'The resulting string' },
        desc: 'Converts an integer to its hexadecimal string represenntation, without a prefix symbol',
        rule: (op, ctx, e) => {
            if (!e.isFeatureEnabled('conversion_functions', op.token, ctx)) {
                return ''
            }
            if (op.children.length === 2) {
                return `${e.calcConstExpr(op.children[1], 'number', ctx).toString(16).toUpperCase()}`
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return ''
            }
        }
    },
    oct: {
        params: [
            { name: 'num', type: 'number', desc: 'The number to convert' }
        ],
        return: { type: 'string', desc: 'The resulting string' },
        desc: 'Converts an integer to its octal string represenntation, without a prefix symbol',
        rule: (op, ctx, e) => {
            if (!e.isFeatureEnabled('conversion_functions', op.token, ctx)) {
                return ''
            }
            if (op.children.length === 2) {
                return `${e.calcConstExpr(op.children[1], 'number', ctx).toString(8)}`
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return ''
            }
        }
    },
    bin: {
        params: [
            { name: 'num', type: 'number', desc: 'The number to convert' }
        ],
        return: { type: 'string', desc: 'The resulting string' },
        desc: 'Converts an integer to its binary string represenntation, without a prefix symbol',
        rule: (op, ctx, e) => {
            if (!e.isFeatureEnabled('conversion_functions', op.token, ctx)) {
                return ''
            }
            if (op.children.length === 2) {
                return `${e.calcConstExpr(op.children[1], 'number', ctx).toString(2)}`
            } else {
                e.error('Function needs exactly one argument', op.children[0].token, ctx)
                return ''
            }
        }
    },
    strrpl: {
        params: [
            { name: 'src', type: 'string', desc: 'The string to replace in' },
            { name: 'pat', type: 'string', desc: 'The string to search for' },
            { name: 'rpl', type: 'string', desc: 'The string to replace the pattern with' }
        ],
        return: { type: 'string', desc: 'The resulting string' },
        desc: 'Replaces all occurances of a pattern within a source string with a replacement string',
        rule: (op, ctx, e) => {
            if (!e.isFeatureEnabled('string_functions', op.token, ctx)) {
                return ''
            }
            if (op.children.length === 4) {
                const source = e.calcConstExpr(op.children[1], 'string', ctx)
                const pattern = e.calcConstExpr(op.children[2], 'string', ctx)
                const replacement = e.calcConstExpr(op.children[3], 'string', ctx)
                return source.split(pattern).join(replacement)
            } else {
                e.error('Function needs exactly three arguments', op.children[0].token, ctx)
                return ''
            }
        }
    },
    strpad: {
        params: [
            { name: 'src', type: 'string', desc: 'The string to pad' },
            { name: 'pad', type: 'string', desc: 'The string to pad with' },
            { name: 'len', type: 'number', desc: 'The length to pad to; if negative, appends instead of prepends' }
        ],
        return: { type: 'string', desc: 'The resulting string' },
        desc: 'Prepends or appends a padding string to a source string until it has the desired length',
        rule: (op, ctx, e) => {
            if (!e.isFeatureEnabled('string_functions', op.token, ctx)) {
                return ''
            }
            if (op.children.length === 4) {
                const source = e.calcConstExpr(op.children[1], 'string', ctx)
                const pad = e.calcConstExpr(op.children[2], 'string', ctx)
                const length = e.calcConstExpr(op.children[3], 'number', ctx)
                return length < 0 ? source.padEnd(Math.abs(length), pad) : source.padStart(Math.abs(length), pad)
            } else {
                e.error('Function needs exactly three arguments', op.children[0].token, ctx)
                return ''
            }
        }
    },
    randint: {
        params: [
            { name: 'min', type: 'number', desc: 'The minimum value (inclusive)' },
            { name: 'max', type: 'number', desc: 'The maximum value (inclusive)' }
        ],
        return: { type: 'number', desc: 'A random number between min and max' },
        desc: 'Generates a random number within a given range',
        rule: (op, ctx, e) => {
            if (!e.isFeatureEnabled('random_functions', op.token, ctx)) {
                return 0
            }
            if (op.children.length === 3) {
                const min = e.calcConstExpr(op.children[1], 'number', ctx)
                const max = e.calcConstExpr(op.children[2], 'number', ctx)
                return ctx.context.rng.range(min, max)
            } else {
                e.error('Function needs exactly two arguments', op.children[0].token, ctx)
                return ''
            }
        }
    },
    randbyte: {
        params: [],
        return: { type: 'number', desc: 'A random number between $00 and $FF (inclusive)' },
        desc: 'Generates a random 8-bit value',
        rule: (op, ctx, e) => {
            if (!e.isFeatureEnabled('random_functions', op.token, ctx)) {
                return 0
            }
            if (op.children.length === 1) {
                return ctx.context.rng.byte()
            } else {
                e.error('Function needs exactly zero arguments', op.children[0].token, ctx)
                return ''
            }
        }
    },
    randword: {
        params: [],
        return: { type: 'number', desc: 'A random number between $0000 and $FFFF (inclusive)' },
        desc: 'Generates a random 16-bit value',
        rule: (op, ctx, e) => {
            if (!e.isFeatureEnabled('random_functions', op.token, ctx)) {
                return 0
            }
            if (op.children.length === 1) {
                return ctx.context.rng.word()
            } else {
                e.error('Function needs exactly zero arguments', op.children[0].token, ctx)
                return ''
            }
        }
    },
    randlong: {
        params: [],
        return: { type: 'number', desc: 'A random number between $00000000 and $FFFFFFFF (inclusive)' },
        desc: 'Generates a random 32-bit value',
        rule: (op, ctx, e) => {
            if (!e.isFeatureEnabled('random_functions', op.token, ctx)) {
                return 0
            }
            if (op.children.length === 1) {
                return ctx.context.rng.long()
            } else {
                e.error('Function needs exactly zero arguments', op.children[0].token, ctx)
                return ''
            }
        }
    }
}

export default FunctionRules
