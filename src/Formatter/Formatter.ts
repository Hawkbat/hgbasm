import * as diff from 'diff'
import Diagnostic from '../Diagnostic'
import Logger from '../Logger'
import Node from '../Node'
import Token from '../Token'
import CasingStyle from './CasingStyle'
import FormatRules from './FormatRules'
import FormatterContext from './FormatterContext'

export default class Formatter {
    public logger: Logger

    constructor(logger: Logger) {
        this.logger = logger
    }

    public format(ctx: FormatterContext): FormatterContext {
        for (let i = ctx.startLine; i <= ctx.endLine; i++) {
            const line = ctx.file.lines[i]
            ctx.line = line
            let result = line.text
            if (line.parse && line.parse.node) {
                result = this.formatNode(line.parse.node, ctx)
            }
            const diffs = diff.diffChars(line.text, result)
            let col = 0
            while (diffs.length) {
                const d = diffs.shift()
                if (d) {
                    if (d.added || d.removed) {
                        ctx.deltas.push({
                            line: i,
                            column: col,
                            add: d.added ? d.value : '',
                            remove: d.removed ? d.value.length : 0
                        })
                    }
                    if (!d.added) {
                        col += d.value.length
                    }
                }
            }
        }
        return ctx
    }

    public formatNode(n: Node, ctx: FormatterContext): string {
        if (FormatRules[n.type]) {
            return FormatRules[n.type](n, ctx, this)
        } else {
            this.error('No formatting rule matches', n.token, ctx)
            return n.token.value
        }
    }

    public indent(ctx: FormatterContext): string {
        if (ctx.options.useSpaces) {
            return ' '.repeat(ctx.options.tabSize)
        } else {
            return '\t'
        }
    }

    public capitalize(str: string, casing: CasingStyle): string {
        switch (casing) {
            case 'uppercase':
                return str.toUpperCase()
            case 'lowercase':
                return str.toLowerCase()
            case 'preserve':
                return str
        }
    }

    public error(msg: string, token: Token | undefined, ctx: FormatterContext): void {
        ctx.diagnostics.push(new Diagnostic('Formatter', msg, 'error', token, ctx.line))
    }
}
