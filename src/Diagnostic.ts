import LineContext from './Assembler/LineContext'
import Token from './Token'
import TokenType from './TokenType'

export default class Diagnostic {
    constructor(
        public area: string,
        public msg: string,
        public type: 'info' | 'warn' | 'error',
        public token?: Token,
        public line?: LineContext
    ) {

    }
    public toString(): string {
        let msg = ''
        if (this.type === 'error') {
            msg += `ERROR: `
        } else if (this.type === 'warn') {
            msg += `warning: `
        } else if (this.type === 'info') {
            msg += `info: `
        }
        if (this.line) {
            msg += `${this.line.file.scope}(${this.line.lineNumber + 1}): `
        }
        msg += `${this.msg}`
        if (this.token) {
            msg += ` at ${TokenType[this.token.type]} ${JSON.stringify(this.token.value)}`
        }
        if (this.line) {
            if (this.token && (this.type === 'error' || this.type === 'warn')) {
                const src = this.line.text
                const whitespace = src.substr(0, this.token.col).replace(/[^\t]/g, ' ')
                msg += `\n${src}\n${whitespace}${'^'.repeat(this.token.value.length)}`
            } else {
                msg += `\n${this.line.text}`
            }
        }
        return msg
    }
}
