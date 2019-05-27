import ExprRule from './ExprRule'
import ExprType from './ExprType'
import SymbolType from './SymbolType'

const ExprRules: { [key in ExprType]: ExprRule } = {
    [ExprType.add]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a + b)
    },
    [ExprType.subtract]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a - b)
    },
    [ExprType.multiply]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a * b)
    },
    [ExprType.divide]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a / b)
    },
    [ExprType.modulo]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a % b)
    },
    [ExprType.negate]: (values) => {
        const a = values.pop() as number
        values.push(-a)
    },
    [ExprType.bitwise_or]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a | b)
    },
    [ExprType.bitwise_and]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a & b)
    },
    [ExprType.bitwise_xor]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a ^ b)
    },
    [ExprType.bitwise_not]: (values) => {
        const a = values.pop() as number
        values.push(~a)
    },
    [ExprType.and]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a !== 0 && b !== 0 ? 1 : 0)
    },
    [ExprType.or]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a !== 0 || b !== 0 ? 1 : 0)
    },
    [ExprType.not]: (values) => {
        const a = values.pop() as number
        values.push(a === 0 ? 1 : 0)
    },
    [ExprType.equal]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a === b ? 1 : 0)
    },
    [ExprType.not_equal]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a !== b ? 1 : 0)
    },
    [ExprType.greater_than]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a > b ? 1 : 0)
    },
    [ExprType.less_than]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a < b ? 1 : 0)
    },
    [ExprType.greater_or_equal]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a >= b ? 1 : 0)
    },
    [ExprType.less_or_equal]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a <= b ? 1 : 0)
    },
    [ExprType.shift_left]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a << b)
    },
    [ExprType.shift_right]: (values) => {
        const b = values.pop() as number
        const a = values.pop() as number
        values.push(a >>> b)
    },
    [ExprType.bank_id]: (values, bs, _, link, ctx, linker) => {
        const symbol = link.file.symbols[bs.readLong()]
        if (symbol.name === '@') {
            values.push(link.bank)
            return
        }
        const symLink = ctx.linkSections.find((l) => l.section === link.file.sections[symbol.sectionId])
        if (symLink) {
            values.push(symLink.bank)
            return
        } else if (symbol.type === SymbolType.Imported) {
            for (const file of ctx.objectFiles) {
                const otherSymbol = file.symbols.find((s) => s.type === SymbolType.Exported && s.name === symbol.name)
                if (otherSymbol) {
                    const otherLink = ctx.linkSections.find((l) => l.section === file.sections[otherSymbol.sectionId])
                    if (otherLink) {
                        values.push(otherLink.bank)
                        return
                    }
                }
            }
        }
        linker.error(`Could not find a definition for symbol "${symbol.name}"`, link.section, ctx)
    },
    [ExprType.bank_section]: (values, bs, _, link, ctx, linker) => {
        const sectionName = bs.readString()
        const otherLink = ctx.linkSections.find((l) => l.section.name === sectionName)
        if (otherLink) {
            values.push(otherLink.bank)
            return
        }
        linker.error(`Could not find a linked section named "${sectionName}"`, link.section, ctx)
    },
    [ExprType.bank_current]: (values, _, __, link) => {
        values.push(link.bank)
    },
    [ExprType.sizeof_id]: (values, bs, _, link, ctx, linker) => {
        const symbol = link.file.symbols[bs.readLong()]
        if (symbol.name === '@') {
            values.push(link.section.size)
            return
        }
        const symLink = ctx.linkSections.find((l) => l.section === link.file.sections[symbol.sectionId])
        if (symLink) {
            const start = symbol.value
            const end = link.file.symbols.reduce((p, c) =>
                c.sectionId === symLink.section.id &&
                    c.type !== SymbolType.Imported &&
                    c.value > start &&
                    (symbol.name.includes('.') || !c.name.includes('.')) ?
                    Math.min(c.value, p) :
                    p,
                symLink.section.size)
            values.push(end - start)
            return
        } else if (symbol.type === SymbolType.Imported) {
            for (const file of ctx.objectFiles) {
                const otherSymbol = file.symbols.find((s) => s.type === SymbolType.Exported && s.name === symbol.name)
                if (otherSymbol) {
                    const otherLink = ctx.linkSections.find((l) => l.section === file.sections[otherSymbol.sectionId])
                    if (otherLink) {
                        const start = otherSymbol.value
                        const end = file.symbols.reduce((p, c) =>
                            c.sectionId === otherLink.section.id &&
                                c.type !== SymbolType.Imported &&
                                c.value > start &&
                                (otherSymbol.name.includes('.') || !c.name.includes('.')) ?
                                Math.min(c.value, p) :
                                p,
                            otherLink.section.size)
                        values.push(end - start)
                        return
                    }
                }
            }
        }
        linker.error(`Could not find a definition for symbol "${symbol.name}"`, link.section, ctx)
    },
    [ExprType.sizeof_section]: (values, bs, _, link, ctx, linker) => {
        const sectionName = bs.readString()
        const otherLink = ctx.linkSections.find((l) => l.section.name === sectionName)
        if (otherLink) {
            values.push(otherLink.section.size)
            return
        }
        linker.error(`Could not find a linked section named "${sectionName}"`, link.section, ctx)
    },
    [ExprType.sizeof_current]: (values, _, __, link) => {
        values.push(link.section.size)
    },
    [ExprType.hram_check]: (values, _, __, link, ctx, linker) => {
        const a = values.pop() as number
        if (a >= 0xFF00 && a <= 0xFFFF) {
            values.push(a & 0xFF)
        } else {
            linker.error('Value must be in HRAM range', link.section, ctx)
        }
    },
    [ExprType.immediate_int]: (values, bs) => {
        values.push(bs.readLong())
    },
    [ExprType.immediate_id]: (values, bs, patch, link, ctx, linker) => {
        const symbol = link.file.symbols[bs.readLong()]
        if (symbol.name === '@') {
            values.push(link.start + patch.offset)
            return
        }
        const symLink = ctx.linkSections.find((l) => l.section === link.file.sections[symbol.sectionId])
        if (symLink) {
            values.push(symLink.start + symbol.value)
            return
        } else if (symbol.type === SymbolType.Imported) {
            for (const file of ctx.objectFiles) {
                const otherSymbol = file.symbols.find((s) => s.type === SymbolType.Exported && s.name === symbol.name)
                if (otherSymbol) {
                    const otherLink = ctx.linkSections.find((l) => l.section === file.sections[otherSymbol.sectionId])
                    if (otherLink) {
                        values.push(otherLink.start + otherSymbol.value)
                        return
                    }
                }
            }
        }
        linker.error(`Could not find a definition for symbol "${symbol.name}"`, link.section, ctx)
    }
}

export default ExprRules
