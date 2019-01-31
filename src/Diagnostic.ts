import LineContext from './Assembler/LineContext'
import Token from './Assembler/Token'
import TokenType from './Assembler/TokenType'

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
        if (this.line) {
            msg += `${this.line.file.scope}(${this.line.getLineNumber() + 1},${this.token ? this.token.col : '0'}): `
        }
        if (this.type === 'error') {
            msg += `${this.area} error: ${this.msg}`
        } else if (this.type === 'warn') {
            msg += `${this.area} warning: ${this.msg}`
        } else if (this.type === 'info') {
            msg += `${this.msg}`
        }
        if (this.token) {
            msg += ` at ${TokenType[this.token.type]} ${JSON.stringify(this.token.value)}`
        }
        if (this.line && (this.type === 'error' || this.type === 'warn')) {
            if (this.token) {
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
