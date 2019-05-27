import TokenType from './TokenType'

export default class Token {
    constructor(
        public type: TokenType,
        public value: string,
        public line: number,
        public col: number
    ) { }
    public clone(): Token {
        return new Token(this.type, this.value, this.line, this.col)
    }
    public toString(): string {
        return `${TokenType[this.type]} ${JSON.stringify(this.value)} (${this.line},${this.col})`
    }
}
