import FileContext from '../Assembler/FileContext'
import PatchType from '../Linker/PatchType'
import KeywordRule from './KeywordRule'

const KeywordRules: { [key: string]: KeywordRule } = {
    equ: (state, op, label, ctx, e) => {
        const labelId = label ? label.token.value.replace(/:/g, '') : ''
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        if (state.numberEquates && state.numberEquates[labelId]) {
            e.error(`Cannot redefine existing equate "${labelId}"`, op.token, ctx)
            return
        }
        state.numberEquates = state.numberEquates ? state.numberEquates : {}
        state.numberEquates[labelId] = {
            id: labelId,
            startLine: state.line,
            endLine: state.line,
            file: state.file,
            value: e.calcConstExpr(op.children[0], 'number', ctx)
        }
        ctx.meta.equ = labelId
        e.logger.logLine('defineSymbol', 'Define number equate', labelId, 'as', state.numberEquates[labelId].toString())
    },
    equs: (state, op, label, ctx, e) => {
        const labelId = label ? label.token.value.replace(/:/g, '') : ''
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        if (!labelId) {
            e.error('Cannot define equate with no label', op.token, ctx)
            return
        }
        if (state.stringEquates && state.stringEquates[labelId]) {
            e.error(`Cannot redefine existing equate "${labelId}"`, op.token, ctx)
            return
        }
        state.stringEquates = state.stringEquates ? state.stringEquates : {}
        state.stringEquates[labelId] = {
            id: labelId,
            startLine: state.line,
            endLine: state.line,
            file: state.file,
            value: e.calcConstExpr(op.children[0], 'string', ctx)
        }
        ctx.meta.equs = labelId
        e.logger.logLine('defineSymbol', 'Define string equate', labelId, 'as', state.stringEquates[labelId].value)
    },
    set: (state, op, label, ctx, e) => {
        const labelId = label ? label.token.value.replace(/:/g, '') : ''
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        state.sets = state.sets ? state.sets : {}
        state.sets[labelId] = {
            id: labelId,
            startLine: state.line,
            endLine: state.line,
            file: state.file,
            value: e.calcConstExpr(op.children[0], 'number', ctx)
        }
        ctx.meta.set = labelId
        e.logger.logLine('defineSymbol', 'Define set', labelId, 'as', state.sets[labelId].value.toString())
    },
    charmap: (state, op, _, ctx, e) => {
        if (op.children.length !== 2) {
            e.error('Keyword needs exactly two arguments', op.token, ctx)
            return
        }
        const key = e.calcConstExpr(op.children[0], 'string', ctx)
        const val = e.calcConstExpr(op.children[1], 'number', ctx)
        state.charmaps = state.charmaps ? state.charmaps : {}
        state.charmaps[key] = val
    },
    if: (state, op, _, ctx, e) => {
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        state.inConditionals = state.inConditionals ? state.inConditionals : []
        state.inConditionals.unshift({ condition: e.calcConstExpr(op.children[0], 'number', ctx) !== 0 })
    },
    elif: (state, op, _, ctx, e) => {
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        if (!state.inConditionals || !state.inConditionals.length) {
            e.error('No matching if or elif to continue', op.token, ctx)
            return
        }
        state.inConditionals[0].condition = e.calcConstExpr(op.children[0], 'number', ctx) !== 0
    },
    else: (state, op, _, ctx, e) => {
        if (!state.inConditionals || !state.inConditionals.length) {
            e.error('No matching if or elif to continue', op.token, ctx)
            return
        }
        state.inConditionals[0].condition = !state.inConditionals[0].condition
    },
    endc: (state, op, _, ctx, e) => {
        if (!state.inConditionals || !state.inConditionals.length) {
            e.error('No matching if, elif, or else to terminate', op.token, ctx)
            return
        }
        state.inConditionals.shift()
    },
    macro: (state, op, label, ctx, e) => {
        const labelId = label ? label.token.value.replace(/:/g, '') : ''
        const lineNumber = ctx.line.lineNumber
        if (state.macros && state.macros[labelId]) {
            e.error('Cannot redefine macros', op.token, ctx)
            return
        }
        state.inMacroDefines = state.inMacroDefines ? state.inMacroDefines : []
        state.inMacroDefines.unshift({
            id: labelId,
            file: state.file,
            startLine: lineNumber,
            endLine: lineNumber
        })
        ctx.meta.macro = labelId
    },
    endm: (state, op, _, ctx, e) => {
        const lineNumber = ctx.line.lineNumber
        if (!state.inMacroDefines || !state.inMacroDefines.length) {
            e.error('No macro definition found to terminate', op.token, ctx)
            return
        }
        if (state.inMacroDefines.length === 1) {
            const define = state.inMacroDefines[0]
            state.macros = state.macros ? state.macros : {}
            state.macros[define.id] = {
                id: define.id,
                file: define.file,
                startLine: define.startLine,
                endLine: lineNumber
            }

            e.logger.logLine('defineSymbol', 'Define macro', define.id)
        }
        state.inMacroDefines.shift()
    },
    shift: (state, op, _, ctx, e) => {
        if (!state.inMacroCalls) {
            e.error('Must be in a macro call to shift macro arguments', op.token, ctx)
            return
        }
        state.inMacroCalls[0].argOffset++
    },
    rept: (state, op, _, ctx, e) => {
        const lineNumber = ctx.line.lineNumber
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        const count = e.calcConstExpr(op.children[0], 'number', ctx)
        state.inRepeats = state.inRepeats ? state.inRepeats : []
        state.inRepeats.unshift({
            count,
            line: lineNumber,
            file: state.file
        })

        state.inMacroDefines = state.inMacroDefines ? state.inMacroDefines : []
        state.inMacroDefines.unshift({
            id: 'rept',
            startLine: lineNumber,
            endLine: -1,
            file: state.file
        })
    },
    endr: async (state, op, _, ctx, e) => {
        const lineNumber = ctx.line.lineNumber
        if (!state.inRepeats || !state.inRepeats.length || !state.inMacroDefines || !state.inMacroDefines.length) {
            e.error('No matching rept to terminate', op.token, ctx)
            return
        }
        state.inMacroDefines.shift()

        const count = state.inRepeats[0].count
        const startLine = state.inRepeats[0].line + 1
        const endLine = lineNumber - 1

        state.inMacroCalls = state.inMacroCalls ? state.inMacroCalls : []
        state.inMacroCalls.unshift({
            id: 'rept',
            args: state.inMacroCalls.length ? state.inMacroCalls[0].args : [],
            argOffset: 0
        })
        state.macroCounter = state.macroCounter ? state.macroCounter + 1 : 1

        for (let i = 0; i < count; i++) {
            const file = new FileContext(ctx.line.file.source, ctx.line.file, `${ctx.line.file.scope}(${lineNumber + 1}) -> rept`, startLine, endLine)
            await ctx.context.assembler.assembleNestedFile(ctx.context, file, state)
        }
        state.inMacroCalls.shift()
        state.inRepeats.shift()
    },
    union: (state, op, _, ctx, e) => {
        if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
            e.error('Unions must be defined within a section', op.token, ctx)
            return
        }
        state.inUnions = state.inUnions ? state.inUnions : []
        state.inUnions.unshift({
            byteOffset: state.sections[state.inSections[0]].bytes.length,
            byteLength: 0
        })
    },
    nextu: (state, op, _, ctx, e) => {
        if (!state.inUnions || !state.inUnions.length) {
            e.error('No matching union to continue', op.token, ctx)
            return
        }
        if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
            e.error('Unions must be defined within a section', op.token, ctx)
            return
        }
        const union = state.inUnions[0]
        const section = state.sections[state.inSections[0]]

        union.byteLength = Math.max(section.bytes.length - union.byteOffset, union.byteLength)
        section.bytes = section.bytes.slice(0, union.byteOffset)
    },
    endu: (state, op, _, ctx, e) => {
        if (!state.inUnions || !state.inUnions.length) {
            e.error('No matching union to terminate', op.token, ctx)
            return
        }
        if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
            e.error('Unions must be defined within a section', op.token, ctx)
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
    rsset: (state, op, _, ctx, e) => {
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        state.rsCounter = e.calcConstExpr(op.children[0], 'number', ctx)
    },
    rb: (state, op, label, ctx, e) => {
        const labelId = label ? label.token.value.replace(/:/g, '') : ''
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        e.logger.logLine('defineSymbol', 'Define set', labelId, 'as', ((state.rsCounter ? state.rsCounter : 0) + e.calcConstExpr(op.children[0], 'number', ctx)).toString())
        state.sets = state.sets ? state.sets : {}
        state.sets[labelId] = {
            id: labelId,
            startLine: state.line,
            endLine: state.line,
            file: state.file,
            value: state.rsCounter ? state.rsCounter : 0
        }
        state.rsCounter = (state.rsCounter ? state.rsCounter : 0) + e.calcConstExpr(op.children[0], 'number', ctx)
    },
    rw: (state, op, label, ctx, e) => {
        const labelId = label ? label.token.value.replace(/:/g, '') : ''
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        e.logger.logLine('defineSymbol', 'Define set', labelId, 'as', ((state.rsCounter ? state.rsCounter : 0) + e.calcConstExpr(op.children[0], 'number', ctx) * 2).toString())
        state.sets = state.sets ? state.sets : {}
        state.sets[labelId] = {
            id: labelId,
            startLine: state.line,
            endLine: state.line,
            file: state.file,
            value: state.rsCounter ? state.rsCounter : 0
        }
        state.rsCounter = (state.rsCounter ? state.rsCounter : 0) + e.calcConstExpr(op.children[0], 'number', ctx) * 2
    },
    rl: (state, op, label, ctx, e) => {
        const labelId = label ? label.token.value.replace(/:/g, '') : ''
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        e.logger.logLine('defineSymbol', 'Define set', labelId, 'as', ((state.rsCounter ? state.rsCounter : 0) + e.calcConstExpr(op.children[0], 'number', ctx) * 4).toString())
        state.sets = state.sets ? state.sets : {}
        state.sets[labelId] = {
            id: labelId,
            startLine: state.line,
            endLine: state.line,
            file: state.file,
            value: state.rsCounter ? state.rsCounter : 0
        }
        state.rsCounter = (state.rsCounter ? state.rsCounter : 0) + e.calcConstExpr(op.children[0], 'number', ctx) * 4
    },
    ds: (state, op, label, ctx, e) => {
        if (label) {
            e.defineLabel(state, label, ctx)
        }
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
            e.error('Cannot define bytes when not inside a section', op.token, ctx)
            return
        }
        state.sections[state.inSections[0]].bytes.push(...new Array(e.calcConstExpr(op.children[0], 'number', ctx)).fill(ctx.options.padding))
    },
    db: (state, op, label, ctx, e) => {
        if (label) {
            e.defineLabel(state, label, ctx)
        }
        if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
            e.error('Cannot define bytes when not inside a section', op.token, ctx)
            return
        }
        if (op.children.length > 0) {
            for (const child of op.children) {
                let arg = e.calcConstExprOrPatch(PatchType.byte, state.sections[state.inSections[0]].bytes.length, child, 'either', ctx)
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
    dw: (state, op, label, ctx, e) => {
        if (label) {
            e.defineLabel(state, label, ctx)
        }
        if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
            e.error('Cannot define bytes when not inside a section', op.token, ctx)
            return
        }
        if (op.children.length > 0) {
            for (const child of op.children) {
                const arg = e.calcConstExprOrPatch(PatchType.word, state.sections[state.inSections[0]].bytes.length, child, 'number', ctx)
                state.sections[state.inSections[0]].bytes.push((arg & 0x00FF) >>> 0, (arg & 0xFF00) >>> 8)
            }
        } else {
            state.sections[state.inSections[0]].bytes.push(ctx.options.padding, ctx.options.padding)
        }
    },
    dl: (state, op, label, ctx, e) => {
        if (label) {
            e.defineLabel(state, label, ctx)
        }
        if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
            e.error('Cannot define bytes when not inside a section', op.token, ctx)
            return
        }
        for (const child of op.children) {
            e.error('Help', child.token, ctx)
        }
        if (op.children.length > 0) {
            for (const child of op.children) {
                const arg = e.calcConstExprOrPatch(PatchType.word, state.sections[state.inSections[0]].bytes.length, child, 'number', ctx)
                state.sections[state.inSections[0]].bytes.push((arg & 0x000000FF) >>> 0, (arg & 0x0000FF00) >>> 8, (arg & 0x00FF0000) >>> 16, (arg & 0xFF000000) >>> 24)
            }
        } else {
            state.sections[state.inSections[0]].bytes.push(ctx.options.padding, ctx.options.padding, ctx.options.padding, ctx.options.padding)
        }
    },
    include: async (state, op, label, ctx, e) => {
        const lineNumber = ctx.line.lineNumber
        if (label) {
            e.defineLabel(state, label, ctx)
        }
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        const inc = await ctx.context.fileProvider.retrieve(e.calcConstExpr(op.children[0], 'string', ctx), ctx.line.file.source, false)
        if (!inc) {
            e.error('Could not find a matching file to include', op.token, ctx)
            return
        }
        if (ctx.context.dependencies.indexOf(inc.path) < 0) {
            ctx.context.dependencies.push(inc.path)
        }
        const file = new FileContext(inc, ctx.line.file, `${ctx.line.file.scope}(${lineNumber + 1}) -> ${inc.path}`)
        await ctx.context.assembler.assembleNestedFile(ctx.context, file, state)
    },
    incbin: async (state, op, label, ctx, e) => {
        if (label) {
            e.defineLabel(state, label, ctx)
        }
        if (op.children.length !== 1 && op.children.length !== 3) {
            e.error('Keyword needs exactly one or exactly three arguments', op.token, ctx)
        }
        if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
            e.error('Cannot include binary data when not inside a section', op.token, ctx)
            return
        }
        const inc = await ctx.context.fileProvider.retrieve(e.calcConstExpr(op.children[0], 'string', ctx), ctx.line.file.source, true)
        if (!inc) {
            e.error('Could not find a matching file to include', op.token, ctx)
            return
        }
        if (ctx.context.dependencies.indexOf(inc.path) < 0) {
            ctx.context.dependencies.push(inc.path)
        }
        const data = new Uint8Array(inc.buffer)
        const startOffset = op.children.length === 3 ? e.calcConstExpr(op.children[1], 'number', ctx) : 0
        const endOffset = op.children.length === 3 ? startOffset + e.calcConstExpr(op.children[2], 'number', ctx) : data.byteLength
        state.sections[state.inSections[0]].bytes.push(...data.slice(startOffset, endOffset))
    },
    export: (state, op, _, ctx, e) => {
        if (!op.children.length) {
            e.error('Keyword needs at least one argument', op.token, ctx)
            return
        }
        for (const child of op.children) {
            const id = child.token.value
            if (!state.labels || !state.labels[id]) {
                e.error('Label is not defined', child.token, ctx)
                continue
            }
            state.labels[id].exported = true
        }
    },
    global: (state, op, _, ctx, e) => {
        if (!op.children.length) {
            e.error('Keyword needs at least one argument', op.token, ctx)
            return
        }
        for (const child of op.children) {
            const id = child.token.value
            if (!state.labels || !state.labels[id]) {
                e.error('Label is not defined', child.token, ctx)
                continue
            }
            state.labels[id].exported = true
        }
    },
    purge: (state, op, _, ctx, e) => {
        if (!op.children.length) {
            e.error('Keyword needs at least one argument', op.token, ctx)
            return
        }
        for (const child of op.children) {
            const id = child.token.value
            let purged = false
            if (state.stringEquates && state.stringEquates[id]) {
                delete state.stringEquates[id]
                e.logger.logLine('purgeSymbol', 'Purge string equate', id)
                purged = true
            }
            if (state.numberEquates && state.numberEquates[id]) {
                delete state.numberEquates[id]
                e.logger.logLine('purgeSymbol', 'Purge string equate', id)
                purged = true
            }
            if (state.sets && state.sets[id]) {
                delete state.sets[id]
                e.logger.logLine('purgeSymbol', 'Purge string equate', id)
                purged = true
            }
            if (state.macros && state.macros[id]) {
                delete state.macros[id]
                e.logger.logLine('purgeSymbol', 'Purge string equate', id)
                purged = true
            }
            if (!purged) {
                e.error('No symbol exists to purge', child.token, ctx)
            }
        }
    },
    section: (state, op, _, ctx, e) => {
        const lineNumber = ctx.line.lineNumber
        if (op.children.length === 0) {
            e.error('Sections must be given a name', op.token, ctx)
            return
        }
        if (op.children.length === 1) {
            e.error('Sections must specify a memory region', op.token, ctx)
            return
        }
        const id = e.calcConstExpr(op.children[0], 'string', ctx)
        const regionOp = op.children[1]
        const bankOp = op.children.find((n) => n.token.value.toLowerCase() === 'bank')
        if (bankOp && bankOp.children.length !== 1) {
            e.error('Bank number must be specified', bankOp.token, ctx)
            return
        }
        const alignOp = op.children.find((n) => n.token.value.toLowerCase() === 'align')
        if (alignOp && alignOp.children.length !== 1) {
            e.error('Alignment number must be specified', alignOp.token, ctx)
            return
        }
        state.sections = state.sections ? state.sections : {}

        const region = regionOp.token.value.toLowerCase()
        const fixedAddress = (regionOp.children.length ? e.calcConstExpr(regionOp.children[0], 'number', ctx) : undefined)
        const bank = (bankOp ? e.calcConstExpr(bankOp.children[0], 'number', ctx) : undefined)
        const alignment = (alignOp ? e.calcConstExpr(alignOp.children[0], 'number', ctx) : undefined)

        if (state.sections[id]) {
            const other = state.sections[id]
            if (other.region !== region || other.fixedAddress !== fixedAddress || other.bank !== bank || other.alignment !== alignment) {
                e.error('Section definition conflicts with an previously defined section', op.token, ctx)
                return
            }
        } else {
            state.sections[id] = {
                id,
                file: state.file,
                bytes: [],
                startLine: lineNumber,
                endLine: lineNumber,
                region,
                fixedAddress,
                bank,
                alignment
            }
        }

        state.inSections = state.inSections ? state.inSections : []
        if (state.inSections.length) {
            state.inSections.shift()
        }
        state.inSections.unshift(id)

        ctx.meta.section = id
    },
    pushs: (state) => {
        state.inSections = state.inSections ? state.inSections : []
        state.inSections.unshift('')
    },
    pops: (state, op, _, ctx, e) => {
        if (!state.inSections || !state.inSections.length) {
            e.error('Cannot pop from empty section stack', op.token, ctx)
            return
        }
        state.inSections.shift()
    },
    opt: (state, op, _, ctx, e) => {
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
                    e.error('Unknown option', child.token, ctx)
                }
            }
        }
    },
    pusho: (state) => {
        state.options = state.options ? state.options : []
        state.options.unshift({})
    },
    popo: (state, op, _, ctx, e) => {
        if (!state.options || !state.options.length) {
            e.error('Cannot pop from empty option stack', op.token, ctx)
            return
        }
        state.options.shift()
    },
    warn: (_, op, __, ctx, e) => {
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        e.warn(e.calcConstExpr(op.children[0], 'string', ctx), undefined, ctx)
    },
    fail: (_, op, __, ctx, e) => {
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        e.error(e.calcConstExpr(op.children[0], 'string', ctx), undefined, ctx)
    },
    printt: (_, op, __, ctx, e) => {
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        e.logger.log('info', e.calcConstExpr(op.children[0], 'string', ctx))
    },
    printv: (_, op, __, ctx, e) => {
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        e.logger.log('info', `$${(e.calcConstExpr(op.children[0], 'number', ctx) >>> 0).toString(16).toUpperCase()}`)
    },
    printi: (_, op, __, ctx, e) => {
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        e.logger.log('info', `${e.calcConstExpr(op.children[0], 'number', ctx)}`)
    },
    printf: (_, op, __, ctx, e) => {
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        e.logger.log('info', `${e.calcConstExpr(op.children[0], 'number', ctx) / 65536}`)
    },
    reseed: (_, op, __, ctx, e) => {
        if (!e.isFeatureEnabled('random_functions', op.token, ctx)) {
            return
        }
        if (op.children.length !== 1) {
            e.error('Keyword needs exactly one argument', op.token, ctx)
            return
        }
        ctx.context.rng.seed(e.calcConstExpr(op.children[0], 'either', ctx))
    }
}

export default KeywordRules
