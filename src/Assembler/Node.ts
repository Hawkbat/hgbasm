import NodeType from './NodeType'
import Token from './Token'

export default class Node {
    constructor(
        public type: NodeType,
        public token: Token,
        public children: Node[]
    ) {

    }
    public clone(): Node {
        return new Node(this.type, this.token, this.children.map((child) => child.clone()))
    }
    public toString(depth: number = 0): string {
        return `${'  '.repeat(depth)}(${NodeType[this.type]}${this.token.value ? ` ${JSON.stringify(this.token.value)}` : ''}${this.children.length ? `\n${this.children.map((n) => n.toString(depth + 1)).join('\n')}\n${'  '.repeat(depth)})` : ')'}`
    }
}
