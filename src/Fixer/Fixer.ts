import Logger from '../Logger'
import FixerContext from './FixerContext'
import Licensee from './Licensee'
import LicenseeCode from './LicenseeCode'
import MBCType from './MBCType'
import RAMSize from './RAMSize'
import ROMSize from './ROMSize'

export default class Fixer {
    public logger: Logger

    constructor(logger: Logger) {
        this.logger = logger
    }

    public fix(ctx: FixerContext): FixerContext {
        if (!ctx.romFile) {
            this.logger.logLine('error', 'Fixer error: File was fixed before linking, aborting')
            return ctx
        }

        let data = new Uint8Array(ctx.romFile)

        const romSizePadFactor = Math.max(0, Math.ceil(Math.log(data.length) / Math.log(2) - 15))
        const romSizePadded = 32768 * Math.pow(2, romSizePadFactor)

        const opts = ctx.options

        if (opts.nintendoLogo !== undefined) {
            data.set([
                0xCE, 0xED, 0x66, 0x66, 0xCC, 0x0D, 0x00, 0x0B, 0x03, 0x73, 0x00, 0x83, 0x00, 0x0C, 0x00, 0x0D,
                0x00, 0x08, 0x11, 0x1F, 0x88, 0x89, 0x00, 0x0E, 0xDC, 0xCC, 0x6E, 0xE6, 0xDD, 0xDD, 0xD9, 0x99,
                0xBB, 0xBB, 0x67, 0x63, 0x6E, 0x0E, 0xEC, 0xCC, 0xDD, 0xDC, 0x99, 0x9F, 0xBB, 0xB9, 0x33, 0x3E
            ].map((n) => opts.nintendoLogo === 'trash' ? ~n : n), 0x0104)
        }
        if (opts.gameTitle !== undefined) {
            data.set(this.stringBytes(opts.gameTitle, '\0', 15), 0x0134)
        }
        if (opts.gameId !== undefined) {
            data.set(this.stringBytes(opts.gameId, ' ', 4), 0x013F)
        }
        if (opts.cgbCompatibility !== undefined) {
            data[0x0143] =
                opts.cgbCompatibility === 'cgb' ? 0xC0 :
                    opts.cgbCompatibility === 'both' ? 0x80 :
                        0x00
        }
        if (opts.licensee !== undefined) {
            const licensee =
                opts.licensee in Licensee ?
                    Licensee[opts.licensee as keyof typeof Licensee] :
                    opts.licensee
            data.set(licensee.padEnd(2, ' ').substr(0, 2).split('').map((c) => c.charCodeAt(0)), 0x0144)
        }
        if (opts.sgbCompatible !== undefined) {
            data[0x0146] = opts.sgbCompatible ? 0x03 : 0x00
        }
        if (opts.mbcType !== undefined) {
            const mbcType =
                typeof opts.mbcType === 'number' ?
                    opts.mbcType :
                    MBCType[opts.mbcType]
            data[0x0147] = mbcType & 0xFF
        }
        if (opts.romSize !== undefined) {
            const romSize =
                typeof opts.romSize === 'number' ?
                    opts.romSize :
                    opts.romSize === 'auto' ?
                        romSizePadFactor :
                        ROMSize[opts.romSize]
            data[0x0148] = romSize & 0xFF
        }
        if (opts.ramSize !== undefined) {
            const ramSize =
                typeof opts.ramSize === 'number' ?
                    opts.ramSize :
                    RAMSize[opts.ramSize]
            data[0x0149] = ramSize & 0xFF
        }
        if (opts.japanese !== undefined) {
            data[0x014A] = opts.japanese ? 0x00 : 0x01
        }
        if (opts.licenseeCode !== undefined) {
            const licenseeCode =
                typeof opts.licenseeCode === 'number' ?
                    opts.licenseeCode :
                    opts.licenseeCode === 'use-licensee' ?
                        0x33 :
                        LicenseeCode[opts.licenseeCode]
            data[0x014B] = licenseeCode & 0xFF
        }
        if (opts.gameVersion !== undefined) {
            data[0x014C] = opts.gameVersion & 0xFF
        }

        if (opts.padding !== undefined) {
            const oldData = data
            data = new Uint8Array(romSizePadded)
            data.fill(opts.padding)
            data.set(oldData, 0)
        }

        if (opts.headerChecksum !== undefined) {
            data[0x014D] = data.slice(0x0134, 0x014D).reduce((p, c) => p - c - 1, 0)
            if (opts.headerChecksum === 'trash') {
                data[0x014D] = ~data[0x014D]
            }
        }
        if (opts.globalChecksum !== undefined) {
            data[0x014E] = 0x00
            data[0x014F] = 0x00
            const checksum = data.reduce((p, c) => p + c, 0)
            data[0x014E] = (checksum & 0xFF00) >>> 8
            data[0x014F] = checksum & 0x00FF
            if (opts.globalChecksum === 'trash') {
                data[0x014E] = ~data[0x014E]
                data[0x014F] = ~data[0x014F]
            }
        }

        ctx.romFile = data

        return ctx
    }

    private stringBytes(str: string, pad: string, len: number): number[] {
        return str.padEnd(len, pad).substr(0, len).split('').map((c) => c.charCodeAt(0))
    }
}
