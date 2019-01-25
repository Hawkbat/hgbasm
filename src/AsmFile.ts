import AsmLine from './AsmLine'

export default class AsmFile {
    public readonly path: string
    public readonly buffer: ArrayBuffer
    public readonly lines: ReadonlyArray<AsmLine>

    constructor(path: string, content: Buffer | string) {
        this.path = path
        if (content instanceof Buffer) {
            this.buffer = content
            this.lines = [...content].map((a) => String.fromCharCode(a)).join('').split(/\r?\n/).map((line) => new AsmLine(this, line))
        } else {
            this.buffer = new Uint8Array(content.split('').map((c) => c.charCodeAt(0)))
            this.lines = content ? content.split(/\r?\n/).map((line) => new AsmLine(this, line)) : []
        }
    }
}
