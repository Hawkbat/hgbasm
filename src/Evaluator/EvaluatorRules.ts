import FileContext from '../Assembler/FileContext'
import PatchType from '../Linker/PatchType'
import NodeType from '../NodeType'
import DirectiveRules from './DirectiveRules'
import EvaluatorRule from './EvaluatorRule'
import KeywordRules from './KeywordRules'
import OpRules from './OpRules'

const EvaluatorRules: { [key: number]: EvaluatorRule } = {
    [NodeType.directive]: (_, op, __, ctx, e) => {
        const args = op.token.value.split(/\s+/)
        const key = args.shift()
        if (!key) {
            e.error('Empty directive', op.token, ctx)
            return
        }
        const rule = DirectiveRules[key.substr(1)]
        if (!rule) {
            e.error('No directive evaluation rule matches', op.token, ctx)
            return
        }
        rule(ctx, args, e)
    },
    [NodeType.unary_operator]: (state, op, label, ctx, e) => {
        if (op.token.value === '=') {
            const labelId = label ? label.token.value.replace(/:/g, '') : ''
            state.sets = state.sets ? state.sets : {}
            state.sets[labelId] = {
                id: labelId,
                line: state.line,
                file: state.file,
                section: state.inSections && state.inSections.length ? state.inSections[0] : '',
                value: e.calcConstExpr(op.children[0], 'number', ctx)
            }
        } else {
            e.error('No unary operator evaluation rule matches', op.token, ctx)
        }
    },
    [NodeType.keyword]: (state, op, label, ctx, e) => {
        const rule = KeywordRules[op.token.value.toLowerCase()]
        if (!rule) {
            e.error('No keyword evaluation rule matches', op.token, ctx)
            return
        }
        return rule(state, op, label, ctx, e)
    },
    [NodeType.opcode]: (state, op, label, ctx, e) => {
        if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
            e.error('Instructions must be placed within a section', op.token, ctx)
            return
        }

        const sectionId = state.inSections[0]
        const sectionLength = state.sections[state.inSections[0]].bytes.length

        if (label) {
            e.defineLabel(state, label, ctx)
        }

        const rule = OpRules[op.token.value.toLowerCase()]
        if (!rule) {
            e.error('No opcode evalution rule matches', op.token, ctx)
            return
        }

        if (!rule.some((variant) => variant.args.length === op.children.length)) {
            e.error('Incorrect number of arguments', op.token, ctx)
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
                        matches = matches && e.isExpr(child)
                        break
                    case 'u3': {
                        const val = e.isExpr(child) ? e.calcConstExpr(child, 'number', ctx) : -1
                        matches = matches && val >= 0 && val <= 7
                        break
                    }
                    case 'vec': {
                        const val = e.isExpr(child) ? e.calcConstExpr(child, 'number', ctx) : -1
                        matches = matches && (val === 0x00 || val === 0x08 || val === 0x10 || val === 0x18 || val === 0x20 || val === 0x28 || val === 0x30 || val === 0x38)
                        break
                    }
                    case '[n8]':
                    case '[n16]':
                        matches = matches && child.type === NodeType.indexer && e.isExpr(child.children[0])
                        break
                    case 'sp+e8':
                        matches = matches && (child.token.value === '+' || child.token.value === '-') && child.children[0].token.value.toLowerCase() === 'sp' && e.isExpr(child.children[1])
                        break
                    case '[$FF00+c]':
                        matches = matches && child.type === NodeType.indexer && child.children[0].token.value === '+' && child.children[0].children[0].token.value.toLowerCase() === '$ff00' && child.children[0].children[1].token.value.toLowerCase() === 'c'
                        break
                    case '[$FF00+n8]': {
                        if (op.token.value.toLowerCase() === 'ld' && !ctx.options.optimizeLd) {
                            matches = false
                        }
                        const val = child.type === NodeType.indexer && e.isExpr(child.children[0]) && e.isConstExpr(child.children[0], ctx) ? e.calcConstExpr(child.children[0], 'number', ctx) : -1
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
                            opcode += 8 * e.calcConstExpr(op.children[i], 'number', ctx)
                            break
                        case 'vec':
                            opcode += e.calcConstExpr(op.children[i], 'number', ctx)
                            break
                    }
                }
                bytes.push(opcode)
                for (let i = 0; i < variant.args.length; i++) {
                    switch (variant.args[i]) {
                        case 'n8': {
                            const val: number = e.calcConstExprOrPatch(PatchType.byte, sectionLength + bytes.length, op.children[i], 'number', ctx)
                            bytes.push(val & 0xFF)
                            break
                        }
                        case 'n16': {
                            const val: number = e.calcConstExprOrPatch(PatchType.word, sectionLength + bytes.length, op.children[i], 'number', ctx)
                            bytes.push((val & 0x00FF) >>> 0, (val & 0xFF00) >>> 8)
                            break
                        }
                        case 'e8': {
                            const val: number = e.calcConstExprOrPatch(PatchType.jr, sectionLength + bytes.length, op.children[i], 'number', ctx)
                            bytes.push(val & 0xFF)
                            break
                        }
                        case 'sp+e8': {
                            const val: number = e.calcConstExprOrPatch(PatchType.byte, sectionLength + bytes.length, op.children[i].children[1], 'number', ctx)
                            if (op.children[i].token.value === '-') {
                                bytes.push((-val + 0x100) & 0xFF)
                            } else {
                                bytes.push(val & 0xFF)
                            }
                            break
                        }
                        case '[n8]': {
                            const val: number = e.calcConstExprOrPatch(PatchType.byte, sectionLength + bytes.length, op.children[i].children[0], 'number', ctx)
                            bytes.push(val & 0xFF)
                            break
                        }
                        case '[n16]': {
                            const val: number = e.calcConstExprOrPatch(PatchType.word, sectionLength + bytes.length, op.children[i].children[0], 'number', ctx)
                            bytes.push((val & 0x00FF) >>> 0, (val & 0xFF00) >>> 8)
                            break
                        }
                        case '[$FF00+n8]': {
                            const val = e.calcConstExpr(op.children[i].children[0], 'number', ctx)
                            bytes.push(val & 0xFF)
                            break
                        }
                    }
                }
                if (ctx.options.nopAfterHalt && op.token.value.toLowerCase() === 'halt') {
                    bytes.push(0x00)
                }
                state.sections[sectionId].bytes.push(...bytes)

                ctx.meta.op = op.token.value.toLowerCase()
                ctx.meta.variant = rule.indexOf(variant)
                return
            }
        }
        e.error('No matching instruction variant', op.token, ctx)
    },
    [NodeType.macro_call]: async (state, op, label, ctx, e) => {
        if (label) {
            e.defineLabel(state, label, ctx)
        }
        if (!state.macros || !state.macros[op.token.value]) {
            e.error('Unimplemented macro call', op.token, ctx)
            return
        }

        const macro = state.macros[op.token.value]
        const startLine = macro.startLine + 1
        const endLine = macro.endLine - 1
        const srcFile = await ctx.context.fileProvider.retrieve(macro.file, ctx.line.file.source, false)
        if (!srcFile) {
            e.error('Macro exists in out-of-scope source file', op.token, ctx)
            return
        }

        if (ctx.context.dependencies.indexOf(srcFile.path) < 0) {
            ctx.context.dependencies.push(srcFile.path)
        }

        const args = op.children.map((n) => e.calcConstExpr(n, 'string', ctx))

        state.inMacroCalls = state.inMacroCalls ? state.inMacroCalls : []
        state.inMacroCalls.unshift({
            id: op.token.value,
            args,
            argOffset: 0
        })
        state.macroCounter = state.macroCounter ? state.macroCounter + 1 : 1
        e.logger.log('enterScope', 'Enter macro call', op.token.value, args.join(', '), '\n')

        const file = new FileContext(srcFile, ctx.line.file, `${ctx.line.file.scope}(${ctx.line.lineNumber + 1}) -> ${macro.id}`, startLine, endLine)
        await ctx.context.assembler.assembleNestedFile(ctx.context, file, state)

        e.logger.log('exitScope', 'Exit macro call', op.token.value, '\n')

        state.inMacroCalls.shift()
    }
}

export default EvaluatorRules
