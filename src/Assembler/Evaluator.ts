import BinarySerializer from '../BinarySerializer'
import Diagnostic from '../Diagnostic'
import ILineState from '../LineState/ILineState'
import ExprType from '../Linker/ExprType'
import PatchType from '../Linker/PatchType'
import SymbolType from '../Linker/SymbolType'
import Logger from '../Logger'
import AssemblerMode from './AssemblerMode'
import EvaluatorContext from './EvaluatorContext'
import FileContext from './FileContext'
import LineContext from './LineContext'
import Node from './Node'
import NodeType from './NodeType'
import OpRules from './OpRules'
import Token from './Token'
import TokenType from './TokenType'

type EvaluatorRule = (state: ILineState, op: Node, label: Node | null, ctx: EvaluatorContext) => void | Promise<void>
type ConstExprRule = (op: Node, ctx: EvaluatorContext) => number | string
type PredefineRule = (op: Node, ctx: EvaluatorContext) => number | string
type DirectiveRule = (ctx: EvaluatorContext, args: string[]) => void

const regexpCache: { [key: string]: RegExp } = {}

function getCachedRegExp(key: string): RegExp {
    if (!regexpCache[key]) {
        regexpCache[key] = new RegExp(key, 'g')
    }
    regexpCache[key].lastIndex = 0
    return regexpCache[key]
}

export default class Evaluator {
    public logger: Logger

    public keywordRules: { [key: string]: EvaluatorRule } = {
        equ: (state, op, label, ctx) => {
            const labelId = label ? label.token.value.replace(/:/g, '') : ''
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            if (state.numberEquates && state.numberEquates[labelId]) {
                this.error(`Cannot redefine existing equate "${labelId}"`, op.token, ctx)
                return
            }
            state.numberEquates = state.numberEquates ? state.numberEquates : {}
            state.numberEquates[labelId] = {
                id: labelId,
                line: state.line,
                file: state.file,
                section: state.inSections && state.inSections.length ? state.inSections[0] : '',
                value: this.calcConstExpr(op.children[0], 'number', ctx)
            }
            this.logger.log('defineSymbol', 'Define number equate', labelId, 'as', state.numberEquates[labelId].toString(), '\n')
        },
        equs: (state, op, label, ctx) => {
            const labelId = label ? label.token.value.replace(/:/g, '') : ''
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            if (!labelId) {
                this.error('Cannot define equate with no label', op.token, ctx)
                return
            }
            if (state.stringEquates && state.stringEquates[labelId]) {
                this.error(`Cannot redefine existing equate "${labelId}"`, op.token, ctx)
                return
            }
            state.stringEquates = state.stringEquates ? state.stringEquates : {}
            state.stringEquates[labelId] = {
                id: labelId,
                line: state.line,
                file: state.file,
                section: state.inSections && state.inSections.length ? state.inSections[0] : '',
                value: this.calcConstExpr(op.children[0], 'string', ctx)
            }
            this.logger.log('defineSymbol', 'Define string equate', labelId, 'as', state.stringEquates[labelId].value, '\n')
        },
        set: (state, op, label, ctx) => {
            const labelId = label ? label.token.value.replace(/:/g, '') : ''
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            state.sets = state.sets ? state.sets : {}
            state.sets[labelId] = {
                id: labelId,
                line: state.line,
                file: state.file,
                section: state.inSections && state.inSections.length ? state.inSections[0] : '',
                value: this.calcConstExpr(op.children[0], 'number', ctx)
            }
            this.logger.log('defineSymbol', 'Define set', labelId, 'as', state.sets[labelId].value.toString(), '\n')
        },
        charmap: (state, op, _, ctx) => {
            if (op.children.length !== 2) {
                this.error('Keyword needs exactly two arguments', op.token, ctx)
                return
            }
            const key = this.calcConstExpr(op.children[0], 'string', ctx)
            const val = this.calcConstExpr(op.children[1], 'number', ctx)
            state.charmaps = state.charmaps ? state.charmaps : {}
            state.charmaps[key] = val
        },
        if: (state, op, _, ctx) => {
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            state.inConditionals = state.inConditionals ? state.inConditionals : []
            state.inConditionals.unshift({ condition: this.calcConstExpr(op.children[0], 'number', ctx) !== 0 })
        },
        elif: (state, op, _, ctx) => {
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            if (!state.inConditionals || !state.inConditionals.length) {
                this.error('No matching if or elif to continue', op.token, ctx)
                return
            }
            state.inConditionals[0].condition = this.calcConstExpr(op.children[0], 'number', ctx) !== 0
        },
        else: (state, op, _, ctx) => {
            if (!state.inConditionals || !state.inConditionals.length) {
                this.error('No matching if or elif to continue', op.token, ctx)
                return
            }
            state.inConditionals[0].condition = !state.inConditionals[0].condition
        },
        endc: (state, op, _, ctx) => {
            if (!state.inConditionals || !state.inConditionals.length) {
                this.error('No matching if, elif, or else to terminate', op.token, ctx)
                return
            }
            state.inConditionals.shift()
        },
        macro: (state, op, label, ctx) => {
            const labelId = label ? label.token.value.replace(/:/g, '') : ''
            const lineNumber = ctx.line.lineNumber
            if (state.macros && state.macros[labelId]) {
                this.error('Cannot redefine macros', op.token, ctx)
                return
            }
            state.inMacroDefines = state.inMacroDefines ? state.inMacroDefines : []
            state.inMacroDefines.unshift({
                id: labelId,
                file: state.file,
                line: lineNumber
            })
        },
        endm: (state, op, _, ctx) => {
            const lineNumber = ctx.line.lineNumber
            if (!state.inMacroDefines || !state.inMacroDefines.length) {
                this.error('No macro definition found to terminate', op.token, ctx)
                return
            }
            if (state.inMacroDefines.length === 1) {
                const define = state.inMacroDefines[0]
                state.macros = state.macros ? state.macros : {}
                state.macros[define.id] = {
                    id: define.id,
                    file: define.file,
                    startLine: define.line,
                    endLine: lineNumber
                }

                this.logger.log('defineSymbol', 'Define macro', define.id, '\n')
            }
            state.inMacroDefines.shift()
        },
        shift: (state, op, _, ctx) => {
            if (!state.inMacroCalls) {
                this.error('Must be in a macro call to shift macro arguments', op.token, ctx)
                return
            }
            state.inMacroCalls[0].argOffset++
        },
        rept: (state, op, _, ctx) => {
            const lineNumber = ctx.line.lineNumber
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            const count = this.calcConstExpr(op.children[0], 'number', ctx)
            state.inRepeats = state.inRepeats ? state.inRepeats : []
            state.inRepeats.unshift({
                count,
                line: lineNumber,
                file: state.file
            })

            state.inMacroCalls = state.inMacroCalls ? state.inMacroCalls : []
            state.inMacroCalls.unshift({
                id: 'rept',
                args: state.inMacroCalls.length ? state.inMacroCalls[0].args : [],
                argOffset: 0
            })

            state.macroCounter = state.macroCounter ? state.macroCounter + 1 : 1
        },
        endr: async (state, op, _, ctx) => {
            const lineNumber = ctx.line.lineNumber
            if (!state.inRepeats || !state.inRepeats.length || !state.inMacroCalls || !state.inMacroCalls.length) {
                this.error('No matching rept to terminate', op.token, ctx)
                return
            }
            const count = state.inRepeats[0].count
            const startLine = state.inRepeats[0].line + 1
            const endLine = lineNumber - 1

            for (let i = 1; i < count; i++) {
                const file = new FileContext(ctx.line.file.source, ctx.line.file, `${ctx.line.file.scope}(${lineNumber + 1}) -> rept`, startLine, endLine)
                await ctx.context.assembler.assembleNestedFile(ctx.context, file, state)
            }
            state.inRepeats.shift()
            state.inMacroCalls.shift()
        },
        union: (state, op, _, ctx) => {
            if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                this.error('Unions must be defined within a section', op.token, ctx)
                return
            }
            state.inUnions = state.inUnions ? state.inUnions : []
            state.inUnions.unshift({
                byteOffset: state.sections[state.inSections[0]].bytes.length,
                byteLength: 0
            })
        },
        nextu: (state, op, _, ctx) => {
            if (!state.inUnions || !state.inUnions.length) {
                this.error('No matching union to continue', op.token, ctx)
                return
            }
            if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                this.error('Unions must be defined within a section', op.token, ctx)
                return
            }
            const union = state.inUnions[0]
            const section = state.sections[state.inSections[0]]

            union.byteLength = Math.max(section.bytes.length - union.byteOffset, union.byteLength)
            section.bytes = section.bytes.slice(0, union.byteOffset)
        },
        endu: (state, op, _, ctx) => {
            if (!state.inUnions || !state.inUnions.length) {
                this.error('No matching union to terminate', op.token, ctx)
                return
            }
            if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                this.error('Unions must be defined within a section', op.token, ctx)
                return
            }
            const union = state.inUnions[0]
            const section = state.sections[state.inSections[0]]
            section.bytes = section.bytes.slice(0, union.byteOffset).concat(new Array(Math.max(section.bytes.length - union.byteOffset, union.byteLength)).fill(ctx.options.padding))
            state.inUnions.shift()
        },
        rsreset: (state) => {
            state.rsCounter = 0
        },
        rsset: (state, op, _, ctx) => {
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            state.rsCounter = this.calcConstExpr(op.children[0], 'number', ctx)
        },
        rb: (state, op, label, ctx) => {
            const labelId = label ? label.token.value.replace(/:/g, '') : ''
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            this.logger.log('defineSymbol', 'Define set', labelId, 'as', ((state.rsCounter ? state.rsCounter : 0) + this.calcConstExpr(op.children[0], 'number', ctx)).toString(), '\n')
            state.sets = state.sets ? state.sets : {}
            state.sets[labelId] = {
                id: labelId,
                line: state.line,
                file: state.file,
                section: state.inSections && state.inSections.length ? state.inSections[0] : '',
                value: state.rsCounter ? state.rsCounter : 0
            }
            state.rsCounter = (state.rsCounter ? state.rsCounter : 0) + this.calcConstExpr(op.children[0], 'number', ctx)
        },
        rw: (state, op, label, ctx) => {
            const labelId = label ? label.token.value.replace(/:/g, '') : ''
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            this.logger.log('defineSymbol', 'Define set', labelId, 'as', ((state.rsCounter ? state.rsCounter : 0) + this.calcConstExpr(op.children[0], 'number', ctx) * 2).toString(), '\n')
            state.sets = state.sets ? state.sets : {}
            state.sets[labelId] = {
                id: labelId,
                line: state.line,
                file: state.file,
                section: state.inSections && state.inSections.length ? state.inSections[0] : '',
                value: state.rsCounter ? state.rsCounter : 0
            }
            state.rsCounter = (state.rsCounter ? state.rsCounter : 0) + this.calcConstExpr(op.children[0], 'number', ctx) * 2
        },
        rl: (state, op, label, ctx) => {
            const labelId = label ? label.token.value.replace(/:/g, '') : ''
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            this.logger.log('defineSymbol', 'Define set', labelId, 'as', ((state.rsCounter ? state.rsCounter : 0) + this.calcConstExpr(op.children[0], 'number', ctx) * 4).toString(), '\n')
            state.sets = state.sets ? state.sets : {}
            state.sets[labelId] = {
                id: labelId,
                line: state.line,
                file: state.file,
                section: state.inSections && state.inSections.length ? state.inSections[0] : '',
                value: state.rsCounter ? state.rsCounter : 0
            }
            state.rsCounter = (state.rsCounter ? state.rsCounter : 0) + this.calcConstExpr(op.children[0], 'number', ctx) * 4
        },
        ds: (state, op, label, ctx) => {
            if (label) {
                this.defineLabel(state, label, ctx)
            }
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                this.error('Cannot define bytes when not inside a section', op.token, ctx)
                return
            }
            state.sections[state.inSections[0]].bytes.push(...new Array(this.calcConstExpr(op.children[0], 'number', ctx)).fill(ctx.options.padding))
        },
        db: (state, op, label, ctx) => {
            if (label) {
                this.defineLabel(state, label, ctx)
            }
            if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                this.error('Cannot define bytes when not inside a section', op.token, ctx)
                return
            }
            if (op.children.length > 0) {
                for (const child of op.children) {
                    let arg = this.calcConstExprOrPatch(PatchType.byte, state.sections[state.inSections[0]].bytes.length, child, 'either', ctx)
                    if (typeof arg === 'string') {
                        if (state.charmaps) {
                            const arr: number[] = []
                            const keys = Object.keys(state.charmaps).sort((a, b) => b.length - a.length)
                            for (let i = 0; i < arg.length; i++) {
                                const key = keys.find((str) => (arg as string).substr(i, str.length) === str)
                                if (key) {
                                    arr.push(state.charmaps[key])
                                    i += key.length - 1
                                } else {
                                    arr.push(arg.charCodeAt(i))
                                }
                            }
                            arg = arr.map((n) => String.fromCharCode(n)).join('')
                        }
                        state.sections[state.inSections[0]].bytes.push(...arg.split('').map((c) => c.charCodeAt(0) & 0xFF))
                    } else {
                        state.sections[state.inSections[0]].bytes.push(arg & 0xFF)
                    }
                }
            } else {
                state.sections[state.inSections[0]].bytes.push(ctx.options.padding)
            }
        },
        dw: (state, op, label, ctx) => {
            if (label) {
                this.defineLabel(state, label, ctx)
            }
            if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                this.error('Cannot define bytes when not inside a section', op.token, ctx)
                return
            }
            if (op.children.length > 0) {
                for (const child of op.children) {
                    const arg = this.calcConstExprOrPatch(PatchType.word, state.sections[state.inSections[0]].bytes.length, child, 'number', ctx)
                    state.sections[state.inSections[0]].bytes.push((arg & 0x00FF) >>> 0, (arg & 0xFF00) >>> 8)
                }
            } else {
                state.sections[state.inSections[0]].bytes.push(ctx.options.padding, ctx.options.padding)
            }
        },
        dl: (state, op, label, ctx) => {
            if (label) {
                this.defineLabel(state, label, ctx)
            }
            if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                this.error('Cannot define bytes when not inside a section', op.token, ctx)
                return
            }
            for (const child of op.children) {
                this.error('Help', child.token, ctx)
            }
            if (op.children.length > 0) {
                for (const child of op.children) {
                    const arg = this.calcConstExprOrPatch(PatchType.word, state.sections[state.inSections[0]].bytes.length, child, 'number', ctx)
                    state.sections[state.inSections[0]].bytes.push((arg & 0x000000FF) >>> 0, (arg & 0x0000FF00) >>> 8, (arg & 0x00FF0000) >>> 16, (arg & 0xFF000000) >>> 24)
                }
            } else {
                state.sections[state.inSections[0]].bytes.push(ctx.options.padding, ctx.options.padding, ctx.options.padding, ctx.options.padding)
            }
        },
        include: async (state, op, label, ctx) => {
            const lineNumber = ctx.line.lineNumber
            if (label) {
                this.defineLabel(state, label, ctx)
            }
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            const inc = await ctx.context.fileProvider.retrieve(this.calcConstExpr(op.children[0], 'string', ctx), ctx.line.file.source, false)
            if (!inc) {
                this.error('Could not find a matching file to include', op.token, ctx)
                return
            }
            if (ctx.context.dependencies.indexOf(inc.path) < 0) {
                ctx.context.dependencies.push(inc.path)
            }
            const file = new FileContext(inc, ctx.line.file, `${ctx.line.file.scope}(${lineNumber + 1}) -> ${inc.path}`)
            await ctx.context.assembler.assembleNestedFile(ctx.context, file, state)
        },
        incbin: async (state, op, label, ctx) => {
            if (label) {
                this.defineLabel(state, label, ctx)
            }
            if (op.children.length !== 1 && op.children.length !== 3) {
                this.error('Keyword needs exactly one or exactly three arguments', op.token, ctx)
            }
            if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                this.error('Cannot include binary data when not inside a section', op.token, ctx)
                return
            }
            const inc = await ctx.context.fileProvider.retrieve(this.calcConstExpr(op.children[0], 'string', ctx), ctx.line.file.source, true)
            if (!inc) {
                this.error('Could not find a matching file to include', op.token, ctx)
                return
            }
            if (ctx.context.dependencies.indexOf(inc.path) < 0) {
                ctx.context.dependencies.push(inc.path)
            }
            const data = new Uint8Array(inc.buffer)
            const startOffset = op.children.length === 3 ? this.calcConstExpr(op.children[1], 'number', ctx) : 0
            const endOffset = op.children.length === 3 ? startOffset + this.calcConstExpr(op.children[2], 'number', ctx) : data.byteLength
            state.sections[state.inSections[0]].bytes.push(...data.slice(startOffset, endOffset))
        },
        export: (state, op, _, ctx) => {
            if (!op.children.length) {
                this.error('Keyword needs at least one argument', op.token, ctx)
                return
            }
            for (const child of op.children) {
                const id = child.token.value
                if (!state.labels || !state.labels[id]) {
                    this.error('Label is not defined', child.token, ctx)
                    continue
                }
                state.labels[id].exported = true
            }
        },
        global: (state, op, _, ctx) => {
            if (!op.children.length) {
                this.error('Keyword needs at least one argument', op.token, ctx)
                return
            }
            for (const child of op.children) {
                const id = child.token.value
                if (!state.labels || !state.labels[id]) {
                    this.error('Label is not defined', child.token, ctx)
                    continue
                }
                state.labels[id].exported = true
            }
        },
        purge: (state, op, _, ctx) => {
            if (!op.children.length) {
                this.error('Keyword needs at least one argument', op.token, ctx)
                return
            }
            for (const child of op.children) {
                const id = child.token.value
                let purged = false
                if (state.stringEquates && state.stringEquates[id]) {
                    delete state.stringEquates[id]
                    this.logger.log('purgeSymbol', 'Purge string equate', id, '\n')
                    purged = true
                }
                if (state.numberEquates && state.numberEquates[id]) {
                    delete state.numberEquates[id]
                    this.logger.log('purgeSymbol', 'Purge string equate', id, '\n')
                    purged = true
                }
                if (state.sets && state.sets[id]) {
                    delete state.sets[id]
                    this.logger.log('purgeSymbol', 'Purge string equate', id, '\n')
                    purged = true
                }
                if (state.macros && state.macros[id]) {
                    delete state.macros[id]
                    this.logger.log('purgeSymbol', 'Purge string equate', id, '\n')
                    purged = true
                }
                if (!purged) {
                    this.error('No symbol exists to purge', child.token, ctx)
                }
            }
        },
        section: (state, op, _, ctx) => {
            const lineNumber = ctx.line.lineNumber
            if (op.children.length === 0) {
                this.error('Sections must be given a name', op.token, ctx)
                return
            }
            if (op.children.length === 1) {
                this.error('Sections must specify a memory region', op.token, ctx)
                return
            }
            const id = this.calcConstExpr(op.children[0], 'string', ctx)
            const regionOp = op.children[1]
            const bankOp = op.children.find((n) => n.token.value.toLowerCase() === 'bank')
            if (bankOp && bankOp.children.length !== 1) {
                this.error('Bank number must be specified', bankOp.token, ctx)
                return
            }
            const alignOp = op.children.find((n) => n.token.value.toLowerCase() === 'align')
            if (alignOp && alignOp.children.length !== 1) {
                this.error('Alignment number must be specified', alignOp.token, ctx)
                return
            }
            state.sections = state.sections ? state.sections : {}
            state.sections[id] = {
                id,
                file: state.file,
                bytes: [],
                startLine: lineNumber,
                region: regionOp.token.value.toLowerCase(),
                fixedAddress: (regionOp.children.length ? this.calcConstExpr(regionOp.children[0], 'number', ctx) : undefined),
                bank: (bankOp ? this.calcConstExpr(bankOp.children[0], 'number', ctx) : undefined),
                alignment: (alignOp ? this.calcConstExpr(alignOp.children[0], 'number', ctx) : undefined)
            }
            state.inSections = state.inSections ? state.inSections : []
            state.inSections.unshift(id)
        },
        pushs: (state) => {
            state.inSections = state.inSections ? state.inSections : []
            state.inSections.unshift('')
        },
        pops: (state, op, _, ctx) => {
            if (!state.inSections || !state.inSections.length || !state.inSections[0]) {
                this.error('Cannot pop from empty section stack', op.token, ctx)
                return
            }
            state.inSections.shift()
        },
        opt: (state, op, _, ctx) => {
            for (const child of op.children) {
                switch (child.token.value.charAt(0)) {
                    case 'g': {
                        state.options = state.options ? state.options : [{}]
                        state.options[0].g = child.token.value.substr(1)
                        continue
                    }
                    case 'b': {
                        state.options = state.options ? state.options : [{}]
                        state.options[0].b = child.token.value.substr(1)
                        continue
                    }
                    case 'z': {
                        state.options = state.options ? state.options : [{}]
                        state.options[0].z = child.token.value.substr(1)
                        continue
                    }
                    default: {
                        this.error('Unknown option', child.token, ctx)
                    }
                }
            }
        },
        pusho: (state) => {
            state.options = state.options ? state.options : []
            state.options.unshift({})
        },
        popo: (state, op, _, ctx) => {
            if (!state.options || !state.options.length) {
                this.error('Cannot pop from empty option stack', op.token, ctx)
                return
            }
            state.options.shift()
        },
        warn: (_, op, __, ctx) => {
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            this.warn(this.calcConstExpr(op.children[0], 'string', ctx), undefined, ctx)
        },
        fail: (_, op, __, ctx) => {
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            this.error(this.calcConstExpr(op.children[0], 'string', ctx), undefined, ctx)
        },
        printt: (_, op, __, ctx) => {
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            this.logger.log('info', this.calcConstExpr(op.children[0], 'string', ctx), '\n')
        },
        printv: (_, op, __, ctx) => {
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            this.logger.log('info', `$${this.calcConstExpr(op.children[0], 'number', ctx).toString(16).toUpperCase()}`, '\n')
        },
        printi: (_, op, __, ctx) => {
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            this.logger.log('info', `${this.calcConstExpr(op.children[0], 'number', ctx)}`, '\n')
        },
        printf: (_, op, __, ctx) => {
            if (op.children.length !== 1) {
                this.error('Keyword needs exactly one argument', op.token, ctx)
                return
            }
            this.logger.log('info', `${this.calcConstExpr(op.children[0], 'number', ctx) / 65536}`, '\n')
        }
    }

    public evalRules: { [key: number]: EvaluatorRule } = {
        [NodeType.directive]: (_, op, __, ctx) => {
            const args = op.token.value.split(/\s+/)
            const key = args.shift()
            if (!key) {
                this.error('Empty directive', op.token, ctx)
                return
            }
            const rule = this.directiveRules[key.substr(1)]
            if (!rule) {
                this.error('No directive evaluation rule matches', op.token, ctx)
                return
            }
            rule(ctx, args)
        },
        [NodeType.unary_operator]: (state, op, label, ctx) => {
            if (op.token.value === '=') {
                const labelId = label ? label.token.value.replace(/:/g, '') : ''
                state.sets = state.sets ? state.sets : {}
                state.sets[labelId] = {
                    id: labelId,
                    line: state.line,
                    file: state.file,
                    section: state.inSections && state.inSections.length ? state.inSections[0] : '',
                    value: this.calcConstExpr(op.children[0], 'number', ctx)
                }
            } else {
                this.error('No unary operator evaluation rule matches', op.token, ctx)
            }
        },
        [NodeType.keyword]: (state, op, label, ctx) => {
            const rule = this.keywordRules[op.token.value.toLowerCase()]
            if (!rule) {
                this.error('No keyword evaluation rule matches', op.token, ctx)
                return
            }
            return rule(state, op, label, ctx)
        },
        [NodeType.opcode]: (state, op, label, ctx) => {
            if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                this.error('Instructions must be placed within a section', op.token, ctx)
                return
            }

            const sectionId = state.inSections[0]
            const sectionLength = state.sections[state.inSections[0]].bytes.length

            if (label) {
                this.defineLabel(state, label, ctx)
            }

            const rule = OpRules[op.token.value.toLowerCase()]
            if (!rule) {
                this.error('No opcode evalution rule matches', op.token, ctx)
                return
            }

            if (!rule.some((variant) => variant.args.length === op.children.length)) {
                this.error('Incorrect number of arguments', op.token, ctx)
                return
            }

            for (const variant of rule) {
                let matches = true

                if (op.children.length !== variant.args.length) {
                    continue
                }

                for (let i = 0; i < variant.args.length; i++) {
                    const child = op.children[i]
                    const arg = variant.args[i]

                    switch (arg) {
                        case 'a':
                        case 'b':
                        case 'c':
                        case 'd':
                        case 'e':
                        case 'h':
                        case 'l':
                        case 'af':
                        case 'bc':
                        case 'de':
                        case 'hl':
                        case 'sp': {
                            if (child.type === NodeType.function_call && child.children.length === 2 && child.children[0].token.value.toLowerCase() === 'high') {
                                matches = matches && child.children[1].token.value.substr(0, 1).toLowerCase() === arg
                            } else if (child.type === NodeType.function_call && child.children.length === 2 && child.children[0].token.value.toLowerCase() === 'low') {
                                matches = matches && child.children[1].token.value.substr(1, 1).toLowerCase() === arg
                            } else {
                                matches = matches && child.token.value.toLowerCase() === arg
                            }
                            break
                        }
                        case 'C':
                        case 'NC':
                        case 'Z':
                        case 'NZ':
                            matches = matches && child.token.value.toUpperCase() === arg
                            break
                        case '[c]':
                        case '[bc]':
                        case '[de]':
                        case '[hl]':
                        case '[hl+]':
                        case '[hl-]':
                        case '[hli]':
                        case '[hld]':
                            matches = matches && child.type === NodeType.indexer && child.children[0].token.value.toLowerCase() === arg.substring(1, arg.length - 1)
                            break
                        case 'n8':
                        case 'n16':
                        case 'e8':
                            matches = matches && this.isExpr(child)
                            break
                        case 'u3': {
                            const val = this.isExpr(child) ? this.calcConstExpr(child, 'number', ctx) : -1
                            matches = matches && val >= 0 && val <= 7
                            break
                        }
                        case 'vec': {
                            const val = this.isExpr(child) ? this.calcConstExpr(child, 'number', ctx) : -1
                            matches = matches && (val === 0x00 || val === 0x08 || val === 0x10 || val === 0x18 || val === 0x20 || val === 0x28 || val === 0x30 || val === 0x38)
                            break
                        }
                        case '[n8]':
                        case '[n16]':
                            matches = matches && child.type === NodeType.indexer && this.isExpr(child.children[0])
                            break
                        case 'sp+e8':
                            matches = matches && (child.token.value === '+' || child.token.value === '-') && child.children[0].token.value.toLowerCase() === 'sp' && this.isExpr(child.children[1])
                            break
                        case '[$FF00+c]':
                            matches = matches && child.type === NodeType.indexer && child.children[0].token.value === '+' && child.children[0].children[0].token.value.toLowerCase() === '$ff00' && child.children[0].children[1].token.value.toLowerCase() === 'c'
                            break
                        case '[$FF00+n8]': {
                            if (op.token.value.toLowerCase() === 'ld' && !ctx.options.optimizeLd) {
                                matches = false
                            }
                            const val = child.type === NodeType.indexer && this.isExpr(child.children[0]) && this.isConstExpr(child.children[0], ctx) ? this.calcConstExpr(child.children[0], 'number', ctx) : -1
                            matches = matches && val >= 0xFF00 && val <= 0xFFFF
                            break
                        }
                    }
                    if (!matches) {
                        break
                    }
                }
                if (matches) {
                    const bytes = []
                    if (variant.prefix) {
                        bytes.push(variant.prefix)
                    }
                    let opcode = variant.opcode
                    for (let i = 0; i < variant.args.length; i++) {
                        switch (variant.args[i]) {
                            case 'u3':
                                opcode += 8 * this.calcConstExpr(op.children[i], 'number', ctx)
                                break
                            case 'vec':
                                opcode += this.calcConstExpr(op.children[i], 'number', ctx)
                                break
                        }
                    }
                    bytes.push(opcode)
                    for (let i = 0; i < variant.args.length; i++) {
                        switch (variant.args[i]) {
                            case 'n8': {
                                const val: number = this.calcConstExprOrPatch(PatchType.byte, sectionLength + bytes.length, op.children[i], 'number', ctx)
                                bytes.push(val & 0xFF)
                                break
                            }
                            case 'n16': {
                                const val: number = this.calcConstExprOrPatch(PatchType.word, sectionLength + bytes.length, op.children[i], 'number', ctx)
                                bytes.push((val & 0x00FF) >>> 0, (val & 0xFF00) >>> 8)
                                break
                            }
                            case 'e8': {
                                const val: number = this.calcConstExprOrPatch(PatchType.jr, sectionLength + bytes.length, op.children[i], 'number', ctx)
                                bytes.push(val & 0xFF)
                                break
                            }
                            case 'sp+e8': {
                                const val: number = this.calcConstExprOrPatch(PatchType.byte, sectionLength + bytes.length, op.children[i].children[1], 'number', ctx)
                                if (op.children[i].token.value === '-') {
                                    bytes.push((-val + 0x100) & 0xFF)
                                } else {
                                    bytes.push(val & 0xFF)
                                }
                                break
                            }
                            case '[n8]': {
                                const val: number = this.calcConstExprOrPatch(PatchType.byte, sectionLength + bytes.length, op.children[i].children[0], 'number', ctx)
                                bytes.push(val & 0xFF)
                                break
                            }
                            case '[n16]': {
                                const val: number = this.calcConstExprOrPatch(PatchType.word, sectionLength + bytes.length, op.children[i].children[0], 'number', ctx)
                                bytes.push((val & 0x00FF) >>> 0, (val & 0xFF00) >>> 8)
                                break
                            }
                            case '[$FF00+n8]': {
                                const val = this.calcConstExpr(op.children[i].children[0], 'number', ctx)
                                bytes.push(val & 0xFF)
                                break
                            }
                        }
                    }
                    if (ctx.options.nopAfterHalt && op.token.value.toLowerCase() === 'halt') {
                        bytes.push(0x00)
                    }
                    state.sections[sectionId].bytes.push(...bytes)
                    return
                }
            }
            this.error('No matching instruction variant', op.token, ctx)
        },
        [NodeType.macro_call]: async (state, op, label, ctx) => {
            if (label) {
                this.defineLabel(state, label, ctx)
            }
            if (!state.macros || !state.macros[op.token.value]) {
                this.error('Unimplemented macro call', op.token, ctx)
                return
            }

            const macro = state.macros[op.token.value]
            const startLine = macro.startLine + 1
            const endLine = macro.endLine - 1
            const srcFile = await ctx.context.fileProvider.retrieve(macro.file, ctx.line.file.source, false)
            if (!srcFile) {
                this.error('Macro exists in out-of-scope source file', op.token, ctx)
                return
            }

            if (ctx.context.dependencies.indexOf(srcFile.path) < 0) {
                ctx.context.dependencies.push(srcFile.path)
            }

            const args = op.children.map((n) => this.calcConstExpr(n, 'string', ctx))

            state.inMacroCalls = state.inMacroCalls ? state.inMacroCalls : []
            state.inMacroCalls.unshift({
                id: op.token.value,
                args,
                argOffset: 0
            })
            state.macroCounter = state.macroCounter ? state.macroCounter + 1 : 1
            this.logger.log('enterScope', 'Enter macro call', op.token.value, args.join(', '), '\n')

            const file = new FileContext(srcFile, ctx.line.file, `${ctx.line.file.scope}(${ctx.line.lineNumber + 1}) -> ${macro.id}`, startLine, endLine)
            await ctx.context.assembler.assembleNestedFile(ctx.context, file, state)

            this.logger.log('exitScope', 'Exit macro call', op.token.value, '\n')

            state.inMacroCalls.shift()
        }
    }

    public directiveRules: { [key: string]: DirectiveRule } = {
        mode: (ctx, args) => {
            if (args.length !== 1) {
                this.error('Directive expects exactly one argument', undefined, ctx)
                return
            }
            const mode = args[0] as AssemblerMode
            if (!Object.values(AssemblerMode).some((v) => v === mode)) {
                this.error('Unsupported mode provided', undefined, ctx)
            }
            ctx.context.mode = mode
        }
    }

    public functionRules: { [key: string]: ConstExprRule } = {
        div: (op, ctx) => {
            if (op.children.length === 3) {
                const a = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                const b = this.calcConstExpr(op.children[2], 'number', ctx) / 65536
                return Math.floor((a / b) * 65536)
            } else {
                this.error('Function needs exactly two arguments', op.children[0].token, ctx)
                return 0
            }
        },
        mul: (op, ctx) => {
            if (op.children.length === 3) {
                const a = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                const b = this.calcConstExpr(op.children[2], 'number', ctx) / 65536
                return Math.floor((a * b) * 65536)
            } else {
                this.error('Function needs exactly two arguments', op.children[0].token, ctx)
                return 0
            }
        },
        sin: (op, ctx) => {
            if (op.children.length === 2) {
                const n = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                return Math.floor(Math.sin(n) * 65536)
            } else {
                this.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        },
        cos: (op, ctx) => {
            if (op.children.length === 2) {
                const n = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                return Math.floor(Math.cos(n) * 65536)
            } else {
                this.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        },
        tan: (op, ctx) => {
            if (op.children.length === 2) {
                const n = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                return Math.floor(Math.tan(n) * 65536)
            } else {
                this.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        },
        asin: (op, ctx) => {
            if (op.children.length === 2) {
                const n = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                return Math.floor(Math.asin(n) * 65536)
            } else {
                this.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        },
        acos: (op, ctx) => {
            if (op.children.length === 2) {
                const n = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                return Math.floor(Math.acos(n) * 65536)
            } else {
                this.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        },
        atan: (op, ctx) => {
            if (op.children.length === 2) {
                const n = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                return Math.floor(Math.atan(n) * 65536)
            } else {
                this.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        },
        atan2: (op, ctx) => {
            if (op.children.length === 3) {
                const a = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                const b = this.calcConstExpr(op.children[2], 'number', ctx) / 65536
                return Math.floor(Math.atan2(b, a) * 65536)
            } else {
                this.error('Function needs exactly two arguments', op.children[0].token, ctx)
                return 0
            }
        },
        strlen: (op, ctx) => {
            if (op.children.length === 2) {
                return this.calcConstExpr(op.children[1], 'string', ctx).length
            } else {
                this.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        },
        strcat: (op, ctx) => {
            if (op.children.length === 3) {
                const a = this.calcConstExpr(op.children[1], 'string', ctx)
                const b = this.calcConstExpr(op.children[2], 'string', ctx)
                return a + b
            } else {
                this.error('Function needs exactly two arguments', op.children[0].token, ctx)
                return ''
            }
        },
        strcmp: (op, ctx) => {
            if (op.children.length === 3) {
                const a = this.calcConstExpr(op.children[1], 'string', ctx)
                const b = this.calcConstExpr(op.children[2], 'string', ctx)
                return a.localeCompare(b)
            } else {
                this.error('Function needs exactly two arguments', op.children[0].token, ctx)
                return ''
            }
        },
        strin: (op, ctx) => {
            if (op.children.length === 3) {
                const a = this.calcConstExpr(op.children[1], 'string', ctx)
                const b = this.calcConstExpr(op.children[2], 'string', ctx)
                return a.indexOf(b) + 1
            } else {
                this.error('Function needs exactly two arguments', op.children[0].token, ctx)
                return ''
            }
        },
        strsub: (op, ctx) => {
            if (op.children.length === 4) {
                const a = this.calcConstExpr(op.children[1], 'string', ctx)
                const b = this.calcConstExpr(op.children[2], 'number', ctx)
                const c = this.calcConstExpr(op.children[3], 'number', ctx)
                return a.substr(b - 1, c)
            } else {
                this.error('Function needs exactly two arguments', op.children[0].token, ctx)
                return ''
            }
        },
        strupr: (op, ctx) => {
            if (op.children.length === 2) {
                return this.calcConstExpr(op.children[1], 'string', ctx).toUpperCase()
            } else {
                this.error('Function needs exactly one argument', op.children[0].token, ctx)
                return ''
            }
        },
        strlwr: (op, ctx) => {
            if (op.children.length === 2) {
                return this.calcConstExpr(op.children[1], 'string', ctx).toLowerCase()
            } else {
                this.error('Function needs exactly one argument', op.children[0].token, ctx)
                return ''
            }
        },
        bank: (op, ctx) => {
            const id = `${op.children[1].token.value.startsWith('.') ? ctx.state.inLabel + op.children[1].token.value : op.children[1].token.value}__BANK`
            if (ctx.state.numberEquates && ctx.state.numberEquates.hasOwnProperty(id)) {
                return ctx.state.numberEquates[id].value
            } else {
                this.error('Bank is not known or no matching symbol', op.children[1].token, ctx)
                return 0
            }
        },
        def: (op, ctx) => {
            if (op.children.length === 2) {
                const id = op.children[1].token.value
                if (ctx.state.labels && ctx.state.labels[id]) {
                    return 1
                }
                if (ctx.state.numberEquates && ctx.state.numberEquates[id]) {
                    return 1
                }
                if (ctx.state.stringEquates && ctx.state.stringEquates[id]) {
                    return 1
                }
                if (ctx.state.sets && ctx.state.sets[id]) {
                    return 1
                }
                if (ctx.state.macros && ctx.state.macros[id]) {
                    return 1
                }
                return 0
            } else {
                this.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        },
        high: (op, ctx) => {
            if (op.children.length === 2) {
                return (this.calcConstExpr(op.children[1], 'number', ctx) & 0xFF00) >>> 8
            } else {
                this.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        },
        low: (op, ctx) => {
            if (op.children.length === 2) {
                return (this.calcConstExpr(op.children[1], 'number', ctx) & 0x00FF) >>> 0
            } else {
                this.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        },
        int: (op, ctx) => {
            if (!this.isFeatureEnabled('conversion_functions', op.token, ctx)) {
                return 0
            }
            if (op.children.length === 2) {
                const str = this.calcConstExpr(op.children[1], 'string', ctx)
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
                this.error('Function needs exactly one argument', op.children[0].token, ctx)
                return 0
            }
        },
        dec: (op, ctx) => {
            if (!this.isFeatureEnabled('conversion_functions', op.token, ctx)) {
                return ''
            }
            if (op.children.length === 2) {
                return `${this.calcConstExpr(op.children[1], 'number', ctx).toString(10)}`
            } else {
                this.error('Function needs exactly one argument', op.children[0].token, ctx)
                return ''
            }
        },
        hex: (op, ctx) => {
            if (!this.isFeatureEnabled('conversion_functions', op.token, ctx)) {
                return ''
            }
            if (op.children.length === 2) {
                return `${this.calcConstExpr(op.children[1], 'number', ctx).toString(16).toUpperCase()}`
            } else {
                this.error('Function needs exactly one argument', op.children[0].token, ctx)
                return ''
            }
        },
        oct: (op, ctx) => {
            if (!this.isFeatureEnabled('conversion_functions', op.token, ctx)) {
                return ''
            }
            if (op.children.length === 2) {
                return `${this.calcConstExpr(op.children[1], 'number', ctx).toString(8)}`
            } else {
                this.error('Function needs exactly one argument', op.children[0].token, ctx)
                return ''
            }
        },
        bin: (op, ctx) => {
            if (!this.isFeatureEnabled('conversion_functions', op.token, ctx)) {
                return ''
            }
            if (op.children.length === 2) {
                return `${this.calcConstExpr(op.children[1], 'number', ctx).toString(2)}`
            } else {
                this.error('Function needs exactly one argument', op.children[0].token, ctx)
                return ''
            }
        }
    }

    public constExprRules: { [key: string]: ConstExprRule } = {
        '!': (op, ctx) => {
            if (op.children.length === 1) {
                return this.calcConstExpr(op.children[0], 'number', ctx) === 0 ? 1 : 0
            } else {
                this.error('Operation needs right argument', op.token, ctx)
                return 0
            }
        },
        '~': (op, ctx) => {
            if (op.children.length === 1) {
                return ~this.calcConstExpr(op.children[0], 'number', ctx)
            } else {
                this.error('Operation needs right argument', op.token, ctx)
                return 0
            }
        },
        '+': (op, ctx) => {
            if (op.children.length === 2) {
                return (this.calcConstExpr(op.children[0], 'number', ctx) + this.calcConstExpr(op.children[1], 'number', ctx)) | 0
            } else if (op.children.length === 1) {
                return this.calcConstExpr(op.children[0], 'number', ctx) | 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '-': (op, ctx) => {
            if (op.children.length === 2) {
                if (ctx.state.labels && op.children[0].type === NodeType.identifier && op.children[1].type === NodeType.identifier) {
                    const left = ctx.state.labels[op.children[0].token.value]
                    const right = ctx.state.labels[op.children[1].token.value]
                    if (left && right && left.section === right.section) {
                        return left.byteOffset - right.byteOffset
                    }
                }
                return (this.calcConstExpr(op.children[0], 'number', ctx) - this.calcConstExpr(op.children[1], 'number', ctx)) | 0
            } else if (op.children.length === 1) {
                return -(this.calcConstExpr(op.children[0], 'number', ctx) | 0)
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '*': (op, ctx) => {
            if (op.children.length === 2) {
                return (this.calcConstExpr(op.children[0], 'number', ctx) * this.calcConstExpr(op.children[1], 'number', ctx)) | 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '/': (op, ctx) => {
            if (op.children.length === 2) {
                return (this.calcConstExpr(op.children[0], 'number', ctx) / this.calcConstExpr(op.children[1], 'number', ctx)) | 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '%': (op, ctx) => {
            if (op.children.length === 2) {
                return (this.calcConstExpr(op.children[0], 'number', ctx) % this.calcConstExpr(op.children[1], 'number', ctx)) | 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '<<': (op, ctx) => {
            if (op.children.length === 2) {
                return this.calcConstExpr(op.children[0], 'number', ctx) << this.calcConstExpr(op.children[1], 'number', ctx)
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '>>': (op, ctx) => {
            if (op.children.length === 2) {
                return this.calcConstExpr(op.children[0], 'number', ctx) >>> this.calcConstExpr(op.children[1], 'number', ctx)
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '&': (op, ctx) => {
            if (op.children.length === 2) {
                return this.calcConstExpr(op.children[0], 'number', ctx) & this.calcConstExpr(op.children[1], 'number', ctx)
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '|': (op, ctx) => {
            if (op.children.length === 2) {
                return this.calcConstExpr(op.children[0], 'number', ctx) | this.calcConstExpr(op.children[1], 'number', ctx)
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '^': (op, ctx) => {
            if (op.children.length === 2) {
                return this.calcConstExpr(op.children[0], 'number', ctx) ^ this.calcConstExpr(op.children[1], 'number', ctx)
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '&&': (op, ctx) => {
            if (op.children.length === 2) {
                const a = this.calcConstExpr(op.children[0], 'number', ctx)
                const b = this.calcConstExpr(op.children[1], 'number', ctx)
                return (a !== 0 && b !== 0) ? 1 : 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '||': (op, ctx) => {
            if (op.children.length === 2) {
                const a = this.calcConstExpr(op.children[0], 'number', ctx)
                const b = this.calcConstExpr(op.children[1], 'number', ctx)
                return (a !== 0 || b !== 0) ? 1 : 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '==': (op, ctx) => {
            if (op.children.length === 2) {
                const a = this.calcConstExpr(op.children[0], 'either', ctx)
                const b = this.calcConstExpr(op.children[1], 'either', ctx)
                return (a === b) ? 1 : 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '!=': (op, ctx) => {
            if (op.children.length === 2) {
                const a = this.calcConstExpr(op.children[0], 'either', ctx)
                const b = this.calcConstExpr(op.children[1], 'either', ctx)
                return (a !== b) ? 1 : 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '<=': (op, ctx) => {
            if (op.children.length === 2) {
                const a = this.calcConstExpr(op.children[0], 'number', ctx)
                const b = this.calcConstExpr(op.children[1], 'number', ctx)
                return (a <= b) ? 1 : 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '>=': (op, ctx) => {
            if (op.children.length === 2) {
                const a = this.calcConstExpr(op.children[0], 'number', ctx)
                const b = this.calcConstExpr(op.children[1], 'number', ctx)
                return (a >= b) ? 1 : 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '<': (op, ctx) => {
            if (op.children.length === 2) {
                const a = this.calcConstExpr(op.children[0], 'number', ctx)
                const b = this.calcConstExpr(op.children[1], 'number', ctx)
                return (a < b) ? 1 : 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '>': (op, ctx) => {
            if (op.children.length === 2) {
                const a = this.calcConstExpr(op.children[0], 'number', ctx)
                const b = this.calcConstExpr(op.children[1], 'number', ctx)
                return (a > b) ? 1 : 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        [NodeType.string]: (op, ctx) => {
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
                    for (const key of Object.keys(this.predefineRules)) {
                        if (source.indexOf(key) === -1) {
                            continue
                        }
                        const val = this.predefineRules[key](op, ctx)
                        const value = typeof val === 'string' ? val : `$${val.toString(16).toUpperCase()}`
                        const regex = getCachedRegExp(`\\{${key}\\}`)
                        const newSource = this.applySourceReplace(source, regex, value)
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
                            const newSource = this.applySourceReplace(source, regex, value)
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
                            const newSource = this.applySourceReplace(source, regex, value)
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
                            const newSource = this.applySourceReplace(source, regex, value)
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
                            const newSource = this.applySourceReplace(source, regex, value)
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
                            const newSource = this.applySourceReplace(source, regex, value)
                            if (source !== newSource) {
                                source = newSource
                                anyReplaced = true
                            }
                        }
                    }
                }
            }
            if (source !== op.token.value) {
                this.logger.log('stringExpansion', 'String expansion of', op.token.value, 'to', source, '\n')
            }
            return source
        },
        [NodeType.function_call]: (op, ctx) => {
            const rule = this.functionRules[op.children[0].token.value.toLowerCase()]
            if (!rule) {
                this.error('Unknown function name', op.children[0].token, ctx)
                return 0
            }
            return rule(op, ctx)
        },
        [NodeType.indexer]: (op, ctx) => {
            return this.calcConstExpr(op.children[0], 'number', ctx)
        },
        [NodeType.identifier]: (op, ctx) => {
            const id = op.token.value.startsWith('.') ? ctx.state.inLabel + op.token.value : op.token.value
            if (this.predefineRules[id]) {
                return this.predefineRules[id](op, ctx)
            }
            if (ctx.state.numberEquates && ctx.state.numberEquates.hasOwnProperty(id)) {
                return ctx.state.numberEquates[id].value
            } else if (ctx.state.stringEquates && ctx.state.stringEquates.hasOwnProperty(id)) {
                return ctx.state.stringEquates[id].value
            } else if (ctx.state.sets && ctx.state.sets.hasOwnProperty(id)) {
                return ctx.state.sets[id].value
            } else if (ctx.state.labels && ctx.state.labels.hasOwnProperty(id)) {
                this.error('Labels cannot be used in constant expressions', op.token, ctx)
                return 0
            } else {
                this.error('No matching symbol defined', op.token, ctx)
                return 0
            }
        },
        [NodeType.number_literal]: (op, ctx) => {
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
            this.error('Invalid number format', op.token, ctx)
            return 0
        }
    }

    public predefineRules: { [key: string]: PredefineRule } = {
        _PI: () => Math.round(Math.PI * 65536),
        _RS: (_, ctx) => ctx.state.rsCounter ? ctx.state.rsCounter : 0,
        _NARG: (_, ctx) => {
            if (ctx.state.inMacroCalls && ctx.state.inMacroCalls.length) {
                return ctx.state.inMacroCalls[0].args.length
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
        __HGBASM_MAJOR__: (op, ctx) => this.isFeatureEnabled('version', op.token, ctx) ? ctx.context.options.version.major : 0,
        __HGBASM_MINOR__: (op, ctx) => this.isFeatureEnabled('version', op.token, ctx) ? ctx.context.options.version.minor : 0,
        __HGBASM_PATCH__: (op, ctx) => this.isFeatureEnabled('version', op.token, ctx) ? ctx.context.options.version.patch : 0,
        TRUE: (op, ctx) => this.isFeatureEnabled('bool_constants', op.token, ctx) ? 1 : 0,
        FALSE: (op, ctx) => this.isFeatureEnabled('bool_constants', op.token, ctx) ? 0 : 0,
        true: (op, ctx) => this.isFeatureEnabled('bool_constants', op.token, ctx) ? 1 : 0,
        false: (op, ctx) => this.isFeatureEnabled('bool_constants', op.token, ctx) ? 0 : 0
    }

    public linkExprBinaryRules: { [key: string]: ExprType } = {
        '+': ExprType.add,
        '-': ExprType.subtract,
        '*': ExprType.multiply,
        '/': ExprType.divide,
        '%': ExprType.modulo,
        '|': ExprType.bitwise_or,
        '&': ExprType.bitwise_and,
        '^': ExprType.bitwise_xor,
        '&&': ExprType.and,
        '||': ExprType.or,
        '==': ExprType.equal,
        '!=': ExprType.not_equal,
        '>': ExprType.greater_than,
        '<': ExprType.less_than,
        '>=': ExprType.greater_or_equal,
        '<=': ExprType.less_or_equal,
        '<<': ExprType.shift_left,
        '>>': ExprType.shift_right
    }

    public linkExprUnaryRules: { [key: string]: ExprType } = {
        '-': ExprType.negate,
        '~': ExprType.bitwise_not,
        '!': ExprType.not
    }

    constructor(logger: Logger) {
        this.logger = logger
    }

    public async evaluate(ctx: EvaluatorContext): Promise<EvaluatorContext> {
        if (!ctx.line.lex) {
            this.error('Line was evaluated before lexing, aborting', undefined, ctx)
            return ctx
        }

        if (!ctx.line.parse) {
            this.error('Line was evaluated before parsing, aborting', undefined, ctx)
            return ctx
        }

        const checkConditionals =
            !ctx.state.inConditionals ||
            !ctx.state.inConditionals.length ||
            ctx.state.inConditionals.every((cond) => cond.condition) ||
            (ctx.line.lex.tokens && ctx.line.lex.tokens.some((t) => t.value.toLowerCase() === 'if' || t.value.toLowerCase() === 'elif' || t.value.toLowerCase() === 'else' || t.value.toLowerCase() === 'endc'))

        if (checkConditionals) {
            await this.evaluateLine(ctx.state, ctx.line, ctx)
        }

        ctx.inSection = ctx.state.inSections && ctx.state.inSections.length ? ctx.state.inSections[0] : ''
        ctx.inLabel = ctx.state.inLabel ? ctx.state.inLabel : ''

        ctx.line.eval = ctx

        return ctx
    }

    public async evaluateLine(state: ILineState, line: LineContext, ctx: EvaluatorContext): Promise<void> {
        if (!line.parse || !line.parse.node || line.parse.node.children.length === 0) {
            return
        }

        const children = [...line.parse.node.children]

        let label: Node | null = null
        let op: Node | null = null

        while (children.length > 0) {
            const child = children.pop()
            if (!child) {
                break
            } else if (child.type === NodeType.comment) {
                continue
            } else if (child.type === NodeType.label) {
                label = child
            } else {
                op = child
            }
        }

        if (op) {
            if (this.evalRules[op.type]) {
                await this.evalRules[op.type](state, op, label, ctx)
            } else {
                if (NodeType[op.type] === TokenType[op.token.type]) {
                    this.error('No evaluator rule matches', op.token, ctx)
                } else {
                    this.error(`No evaluator rule matches for node type "${NodeType[op.type]}"`, op.token, ctx)
                }
            }
        } else if (label) {
            this.defineLabel(state, label, ctx)
        }

        return
    }

    public calcConstExprOrPatch(type: PatchType, byteOffset: number, op: Node, expected: 'number', ctx: EvaluatorContext): number
    public calcConstExprOrPatch(type: PatchType, byteOffset: number, op: Node, expected: 'string', ctx: EvaluatorContext): string
    public calcConstExprOrPatch(type: PatchType, byteOffset: number, op: Node, expected: 'either', ctx: EvaluatorContext): number | string
    public calcConstExprOrPatch(type: PatchType, byteOffset: number, op: Node, expected: 'number' | 'string' | 'either', ctx: EvaluatorContext): number | string {
        const defaultValue = (expected === 'string') ? '' : 0
        if (this.isConstExpr(op, ctx)) {
            return this.calcConstExpr(op, expected as any, ctx)
        } else if (this.getConstExprType(op) === 'string') {
            this.error('String expressions must be constant', op.token, ctx)
            return defaultValue
        } else if (!ctx.state.inSections || !ctx.state.inSections.length) {
            this.error('Non-constant expressions must be placed within sections', op.token, ctx)
            return defaultValue
        } else {
            ctx.context.patches.push({
                op,
                file: ctx.state.file,
                line: ctx.state.line,
                section: ctx.state.inSections[0],
                type,
                offset: byteOffset,
                expr: this.buildLinkExpr(new BinarySerializer([]), op, ctx)
            })
            return defaultValue
        }
    }

    public calcConstExpr(op: Node, expected: 'number', ctx: EvaluatorContext): number
    public calcConstExpr(op: Node, expected: 'string', ctx: EvaluatorContext): string
    public calcConstExpr(op: Node, expected: 'either', ctx: EvaluatorContext): number | string
    public calcConstExpr(op: Node, expected: 'number' | 'string' | 'either', ctx: EvaluatorContext): number | string {
        const defaultValue = (expected === 'string') ? '' : 0
        let rule = this.constExprRules[op.type]
        if (!rule) {
            rule = this.constExprRules[op.token.value.toLowerCase()]
        }
        if (rule) {
            let val = rule(op, ctx)
            if (expected === 'number' && typeof val === 'string') {
                if (ctx.state && ctx.state.charmaps && ctx.state.charmaps.hasOwnProperty(val)) {
                    val = ctx.state.charmaps[val]
                } else if (val.length === 1) {
                    val = val.charCodeAt(0)
                }
            }
            if (expected !== 'either' && typeof val !== expected) {
                this.error(`Constant expression does not evaluate to ${expected}`, op.token, ctx)
                return defaultValue
            }
            return val
        }
        this.error('No constant-expression rule matches', op.token, ctx)
        return defaultValue
    }

    public isExpr(op: Node): boolean {
        return !!this.constExprRules[op.type] || !!this.constExprRules[op.token.value.toLowerCase()]
    }

    public isConstExpr(op: Node, ctx: EvaluatorContext): boolean {
        if (op.type === NodeType.binary_operator && op.token.value === '-') {
            if (ctx.state.labels && op.children[0].type === NodeType.identifier && op.children[1].type === NodeType.identifier) {
                const left = ctx.state.labels[op.children[0].token.value]
                const right = ctx.state.labels[op.children[1].token.value]
                if (left && right && left.section === right.section) {
                    return true
                }
            }
        }
        if (op.type === NodeType.identifier) {
            if (this.predefineRules[op.token.value]) {
                return true
            }
            if (ctx.state.numberEquates && ctx.state.numberEquates.hasOwnProperty(op.token.value)) {
                return true
            } else if (ctx.state.stringEquates && ctx.state.stringEquates.hasOwnProperty(op.token.value)) {
                return true
            } else if (ctx.state.sets && ctx.state.sets.hasOwnProperty(op.token.value)) {
                return true
            }
            return false
        }
        for (const child of op.children) {
            if (!this.isConstExpr(child, ctx)) {
                return false
            }
        }
        return true
    }

    public getConstExprType(op: Node): 'number' | 'string' {
        if (op.type === NodeType.string) {
            return 'string'
        }
        if (op.type === NodeType.function_call) {
            const func = op.children[0].token.value.toLowerCase()
            if (func === 'strcat' || func === 'strsub' || func === 'strupr' || func === 'strlwr') {
                return 'string'
            }
        }
        return 'number'
    }

    public buildLinkExpr(bs: BinarySerializer, op: Node, ctx: EvaluatorContext): number[] {
        switch (op.type) {
            case NodeType.binary_operator: {
                const rule = this.linkExprBinaryRules[op.token.value]
                if (rule !== undefined) {
                    this.buildLinkExpr(bs, op.children[0], ctx)
                    this.buildLinkExpr(bs, op.children[1], ctx)
                    bs.writeByte(rule)
                } else {
                    this.error('No link expression rule matches operator', op.token, ctx)
                }
                break
            }
            case NodeType.unary_operator: {
                const rule = this.linkExprUnaryRules[op.token.value]
                if (rule !== undefined) {
                    this.buildLinkExpr(bs, op.children[0], ctx)
                    bs.writeByte(rule)
                } else {
                    this.error('No link expression rule matches operator', op.token, ctx)
                }
                break
            }
            case NodeType.function_call: {
                if (op.children[0].token.value.toLowerCase() === 'bank') {
                    if (op.children[1].token.value === '@') {
                        bs.writeByte(ExprType.bank_current)
                    } else if (op.children[1].type === NodeType.identifier) {
                        let id = op.children[1].token.value
                        if (id.startsWith('.')) {
                            id = ctx.state.inLabel + id
                        }
                        const symbol = ctx.context.objectFile.symbols.find((s) => s.name === id)
                        if (symbol) {
                            bs.writeByte(ExprType.bank_id)
                            bs.writeLong(symbol.id)
                        } else {
                            const newSymbolId = ctx.context.objectFile.symbols.length
                            ctx.context.objectFile.symbols.push({
                                id: newSymbolId,
                                name: id,
                                type: SymbolType.Imported,
                                file: '',
                                line: -1,
                                sectionId: -1,
                                value: -1
                            })
                            bs.writeByte(ExprType.bank_id)
                            bs.writeLong(newSymbolId)
                        }
                    } else if (this.isConstExpr(op.children[1], ctx) && this.getConstExprType(op.children[1]) === 'string') {
                        bs.writeByte(ExprType.bank_section)
                        bs.writeString(this.calcConstExpr(op, 'string', ctx))
                    } else {
                        this.error('No link expression rule matches function', op.children[0].token, ctx)
                    }
                } else if (op.children[0].token.value.toLowerCase() === 'high') {
                    bs.writeByte(ExprType.immediate_int)
                    bs.writeLong(0xFF00)
                    this.buildLinkExpr(bs, op.children[1], ctx)
                    bs.writeByte(ExprType.bitwise_and)
                    bs.writeByte(ExprType.immediate_int)
                    bs.writeLong(8)
                    bs.writeByte(ExprType.shift_right)
                } else if (op.children[0].token.value.toLowerCase() === 'low') {
                    bs.writeByte(ExprType.immediate_int)
                    bs.writeLong(0x00FF)
                    this.buildLinkExpr(bs, op.children[1], ctx)
                    bs.writeByte(ExprType.bitwise_and)
                } else {
                    this.error('No link expression rule matches function', op.children[0].token, ctx)
                }
                break
            }
            case NodeType.number_literal: {
                bs.writeByte(ExprType.immediate_int)
                bs.writeLong(this.calcConstExpr(op, 'number', ctx))
                break
            }
            case NodeType.identifier: {
                let id = op.token.value
                if (id.startsWith('.')) {
                    id = ctx.state.inLabel + id
                }
                if (ctx.state.numberEquates && ctx.state.numberEquates[id]) {
                    bs.writeByte(ExprType.immediate_int)
                    bs.writeLong(ctx.state.numberEquates[id].value)
                } else if (ctx.state.sets && ctx.state.sets[id]) {
                    bs.writeByte(ExprType.immediate_int)
                    bs.writeLong(ctx.state.sets[id].value)
                } else {
                    const symbol = ctx.context.objectFile.symbols.find((s) => s.name === id)
                    if (symbol) {
                        bs.writeByte(ExprType.immediate_id)
                        bs.writeLong(symbol.id)
                        if (id === '@' && !/\bd[bwl]\b/i.test(ctx.line.text)) {
                            bs.writeByte(ExprType.immediate_int)
                            bs.writeLong(1)
                            bs.writeByte(ExprType.subtract)
                        }
                    } else {
                        const newSymbolId = ctx.context.objectFile.symbols.length
                        ctx.context.objectFile.symbols.push({
                            id: newSymbolId,
                            name: id,
                            type: SymbolType.Imported,
                            file: '',
                            line: -1,
                            sectionId: -1,
                            value: -1
                        })
                        bs.writeByte(ExprType.immediate_id)
                        bs.writeLong(newSymbolId)
                        if (id === '@' && !/\bd[bwl]\b/i.test(ctx.line.text)) {
                            bs.writeByte(ExprType.immediate_int)
                            bs.writeLong(1)
                            bs.writeByte(ExprType.subtract)
                        }
                    }
                }
                break
            }
            default:
                this.error('No link expression rule matches', op.token, ctx)
                break
        }
        return bs.buf as number[]
    }

    public defineLabel(state: ILineState, label: Node, ctx: EvaluatorContext): void {
        const exported = label.token.value.endsWith('::')
        const local = label.token.value.indexOf('.') >= 0
        let labelId = label.token.value.replace(':', '').replace(':', '')
        if (local) {
            if (state.inLabel) {
                if (labelId.startsWith('.')) {
                    labelId = state.inLabel + labelId
                } else if (labelId.substr(0, labelId.indexOf('.')) !== state.inLabel) {
                    this.error('Local label defined within wrong global label', label.token, ctx)
                    return
                }
            } else {
                this.error('Local label defined before any global labels', label.token, ctx)
                return
            }
        }
        if (state.labels && state.labels[labelId]) {
            this.error('Label already defined', label.token, ctx)
            return
        }
        if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
            this.error('Labels must be defined within a section', label.token, ctx)
            return
        }
        this.logger.log('defineSymbol', 'Define label', labelId, '\n')

        state.labels = state.labels ? state.labels : {}
        state.labels[labelId] = {
            id: labelId,
            line: state.line,
            file: ctx.context.file.source.path,
            section: state.inSections[0],
            byteOffset: state.sections[state.inSections[0]].bytes.length,
            exported: exported || ctx.options.exportAllLabels
        }
        state.inLabel = local ? state.inLabel : labelId
    }

    public applySourceReplace(source: string, regex: RegExp, value: string): string {
        let matches = regex.exec(source)
        while (matches !== null) {
            const dstIndex = matches.index
            const dstLength = value.length
            const srcLength = matches[0].length

            source = source.substring(0, dstIndex) + value + source.substring(dstIndex + srcLength)

            regex.lastIndex = dstIndex + dstLength
            matches = regex.exec(source)
        }
        return source
    }

    public isFeatureEnabled(feature: string, token: Token | undefined, ctx: EvaluatorContext): boolean {
        if (ctx.context.mode !== AssemblerMode.new_features_enabled) {
            this.error(`Cannot use HGBASM-specific feature "${feature}" in RGBDS compatibility mode; add "#mode hgbasm" to a previous line to enable it`, token, ctx)
            return false
        }
        return true
    }

    public error(msg: string, token: Token | undefined, ctx: EvaluatorContext): void {
        ctx.diagnostics.push(new Diagnostic('Evaluator', msg, 'error', token, ctx.line))
    }

    public warn(msg: string, token: Token | undefined, ctx: EvaluatorContext): void {
        ctx.diagnostics.push(new Diagnostic('Evaluator', msg, 'warn', token, ctx.line))
    }
}
