
export default class BinarySerializer {
    public index: number = 0

    constructor(public buf: { [key: number]: number, length: number }) {

    }

    public reachedEnd(): boolean {
        return this.index >= this.buf.length
    }

    public readByte(): number {
        return this.buf[this.index++]
    }

    public readShort(): number {
        return this.readByte() + (this.readByte() << 8)
    }

    public readLong(): number {
        return this.readShort() + (this.readShort() << 16)
    }

    public readChars(count: number): string {
        let result = ''
        for (let i = 0; i < count; i++) {
            result += String.fromCharCode(this.buf[this.index++])
        }
        return result
    }

    public readString(): string {
        let result = ''
        while (this.buf[this.index] !== 0) {
            result += String.fromCharCode(this.buf[this.index++])
        }
        this.index++
        return result
    }

    public readBytes(count: number): number[] {
        const result = []
        for (let i = 0; i < count; i++) {
            result.push(this.buf[this.index++])
        }
        return result
    }

    public writeByte(v: number): void {
        this.buf[this.index++] = (v + 0x100) & 0xFF
    }

    public writeShort(v: number): void {
        this.writeByte(v & 0x00FF)
        this.writeByte((v & 0xFF00) >>> 8)
    }

    public writeLong(v: number): void {
        this.writeShort(v & 0x0000FFFF)
        this.writeShort((v & 0xFFFF0000) >>> 16)
    }

    public writeChars(v: string): void {
        for (let i = 0; i < v.length; i++) {
            this.buf[this.index++] = v.charCodeAt(i)
        }
    }

    public writeString(v: string): void {
        for (let i = 0; i < v.length; i++) {
            this.buf[this.index++] = v.charCodeAt(i)
        }
        this.buf[this.index++] = 0
    }

    public writeBytes(vs: number[]): void {
        for (const v of vs) {
            this.buf[this.index++] = v
        }
    }
}
