
export default class RandGen {
    private state: number = 0x12345678

    constructor(seed?: number | string) {
        if (seed !== undefined) {
            this.seed(seed)
        }
    }

    public seed(seed: number | string): number {
        let hash = 0

        if (typeof seed === 'string') {
            hash = 5381
            let i = seed.length
            while (i) {
                hash = (hash * 33) ^ seed.charCodeAt(--i)
            }
        } else {
            hash = seed
        }

        hash = hash >>> 0

        if (hash === 0) {
            hash = 1
        }

        this.state = hash
        return hash
    }

    public byte(): number {
        return this.next() & 0xFF
    }

    public word(): number {
        return this.next() & 0xFFFF
    }

    public long(): number {
        return this.next() & 0xFFFFFFFF
    }

    public float(): number {
        return this.next() / 0x100000000
    }

    public range(min: number, max: number): number {
        return min + Math.round(this.float() * (max - min))
    }

    private next(): number {
        let x = this.state
        x ^= x << 13
        x ^= x >>> 17
        x ^= x << 5
        x = x >>> 0
        this.state = x
        return x
    }
}
