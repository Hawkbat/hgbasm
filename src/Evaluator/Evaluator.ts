import AssemblerMode from '../Assembler/AssemblerMode'
import LineContext from '../Assembler/LineContext'
import BinarySerializer from '../BinarySerializer'
import Diagnostic from '../Diagnostic'
import ILineState from '../LineState/ILineState'
import ExprType from '../Linker/ExprType'
import PatchType from '../Linker/PatchType'
import SymbolType from '../Linker/SymbolType'
import Logger from '../Logger'
import Node from '../Node'
import NodeType from '../NodeType'
import Token from '../Token'
import TokenType from '../TokenType'
import ConstExprRules from './ConstExprRules'
import EvaluatorContext from './EvaluatorContext'
import EvaluatorRules from './EvaluatorRules'
import FunctionRules from './FunctionRules'
import LinkExprBinaryRules from './LinkExprBinaryRules'
import LinkExprUnaryRules from './LinkExprUnaryRules'
import PredefineRules from './PredefineRules'

export default class Evaluator {
    public logger: Logger

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
        const checkRepts =
            !ctx.state.inRepeats ||
            !ctx.state.inRepeats.length ||
            (ctx.line.lex.tokens && ctx.line.lex.tokens.some((t) => t.value.toLowerCase() === 'endr'))

        if (checkConditionals && checkRepts) {
            await this.evaluateLine(ctx.state, ctx.line, ctx)
        }

        ctx.meta.inSection = ctx.state.inSections && ctx.state.inSections.length ? ctx.state.inSections[0] : ''
        ctx.meta.inGlobalLabel = ctx.state.inGlobalLabel ? ctx.state.inGlobalLabel : ''
        ctx.meta.inLabel = ctx.state.inLabel ? ctx.state.inLabel : ''

        if (ctx.meta.inSection && ctx.state.sections) {
            const section = ctx.state.sections[ctx.meta.inSection]
            section.endLine = ctx.line.lineNumber

            if (ctx.meta.inGlobalLabel && ctx.state.labels) {
                const label = ctx.state.labels[ctx.meta.inGlobalLabel]
                label.endLine = ctx.line.lineNumber
                label.byteSize = section.bytes.length - label.byteOffset
            }
            if (ctx.meta.inLabel && ctx.state.labels) {
                const label = ctx.state.labels[ctx.meta.inLabel]
                label.endLine = ctx.line.lineNumber
                label.byteSize = section.bytes.length - label.byteOffset
            }
        }

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
            if (EvaluatorRules[op.type]) {
                await EvaluatorRules[op.type](state, op, label, ctx, this)
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
        if (!this.isConstExpr(op, ctx)) {
            this.error('Expression must be constant', op.token, ctx)
            return defaultValue
        }
        let rule = ConstExprRules[op.type]
        if (!rule) {
            rule = ConstExprRules[op.token.value.toLowerCase()]
        }
        if (rule) {
            let val = rule(op, ctx, this)
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
        return !!ConstExprRules[op.type] || !!ConstExprRules[op.token.value.toLowerCase()]
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
            if (PredefineRules[op.token.value]) {
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
        if (op.type === NodeType.function_call) {
            const func = op.children[0].token.value.toLowerCase()
            if (func === 'bank' && this.isConstExpr(op.children[1], ctx) && this.getConstExprType(op.children[1]) === 'string') {
                return false
            }
            if (func === 'sizeof' && this.isConstExpr(op.children[1], ctx) && this.getConstExprType(op.children[1]) === 'string') {
                return false
            }
            if (func === 'def') {
                return true
            }
            for (const child of op.children.slice(1)) {
                if (!this.isConstExpr(child, ctx)) {
                    return false
                }
            }
            return true
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
            if (FunctionRules[func]) {
                return FunctionRules[func].return.type
            }
        }
        return 'number'
    }

    public buildLinkExpr(bs: BinarySerializer, op: Node, ctx: EvaluatorContext): number[] {
        switch (op.type) {
            case NodeType.binary_operator: {
                const rule = LinkExprBinaryRules[op.token.value]
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
                const rule = LinkExprUnaryRules[op.token.value]
                if (rule !== undefined) {
                    this.buildLinkExpr(bs, op.children[0], ctx)
                    bs.writeByte(rule)
                } else {
                    this.error('No link expression rule matches operator', op.token, ctx)
                }
                break
            }
            case NodeType.function_call: {
                const name = op.children[0].token.value.toLowerCase()
                if (name === 'bank') {
                    if (op.children[1].token.value === '@') {
                        bs.writeByte(ExprType.bank_current)
                    } else if (op.children[1].type === NodeType.identifier) {
                        let id = op.children[1].token.value
                        if (id.startsWith('.')) {
                            id = ctx.state.inGlobalLabel + id
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
                        bs.writeString(this.calcConstExpr(op.children[1], 'string', ctx))
                    } else {
                        this.error('No link expression rule matches function', op.children[0].token, ctx)
                    }
                } else if (name === 'high') {
                    bs.writeByte(ExprType.immediate_int)
                    bs.writeLong(0xFF00)
                    this.buildLinkExpr(bs, op.children[1], ctx)
                    bs.writeByte(ExprType.bitwise_and)
                    bs.writeByte(ExprType.immediate_int)
                    bs.writeLong(8)
                    bs.writeByte(ExprType.shift_right)
                } else if (name === 'low') {
                    bs.writeByte(ExprType.immediate_int)
                    bs.writeLong(0x00FF)
                    this.buildLinkExpr(bs, op.children[1], ctx)
                    bs.writeByte(ExprType.bitwise_and)
                } else if (name === 'sizeof') {
                    if (!this.isFeatureEnabled('sizeof', op.token, ctx)) {
                        break
                    }
                    if (op.children[1].token.value === '@') {
                        bs.writeByte(ExprType.sizeof_current)
                    } else if (op.children[1].type === NodeType.identifier) {
                        let id = op.children[1].token.value
                        if (id.startsWith('.')) {
                            id = ctx.state.inGlobalLabel + id
                        }
                        const symbol = ctx.context.objectFile.symbols.find((s) => s.name === id)
                        if (symbol) {
                            bs.writeByte(ExprType.sizeof_id)
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
                            bs.writeByte(ExprType.sizeof_id)
                            bs.writeLong(newSymbolId)
                        }
                    } else if (this.isConstExpr(op.children[1], ctx) && this.getConstExprType(op.children[1]) === 'string') {
                        bs.writeByte(ExprType.sizeof_section)
                        bs.writeString(this.calcConstExpr(op.children[1], 'string', ctx))
                    } else {
                        this.error('No link expression rule matches function', op.children[0].token, ctx)
                    }
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
                    id = ctx.state.inGlobalLabel + id
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
            if (state.inGlobalLabel) {
                if (labelId.startsWith('.')) {
                    labelId = state.inGlobalLabel + labelId
                } else if (labelId.substr(0, labelId.indexOf('.')) !== state.inGlobalLabel) {
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
        this.logger.logLine('defineSymbol', 'Define label', labelId)

        state.labels = state.labels ? state.labels : {}
        state.labels[labelId] = {
            id: labelId,
            startLine: state.line,
            endLine: state.line,
            file: ctx.context.file.source.path,
            section: state.inSections[0],
            byteOffset: state.sections[state.inSections[0]].bytes.length,
            byteSize: 0,
            exported: exported || ctx.options.exportAllLabels
        }
        state.inGlobalLabel = local ? state.inGlobalLabel : labelId
        state.inLabel = labelId

        ctx.meta.label = labelId
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
