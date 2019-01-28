import Compiler from './Compiler'
import CompilerContext from './CompilerContext'
import FixerContext from './FixerContext'
import IFixerOptions from './IFixerOptions'

export default class Fixer {
    constructor(public compiler: Compiler) {

    }

    public fix(context: CompilerContext, options: IFixerOptions): FixerContext {
        const ctx = new FixerContext(options, context)

        if (!context.link || !context.link.romData) {
            this.compiler.logger.log('diagnosticError', 'Fixer error: File was fixed before linking, aborting')
            return ctx
        }

        let data = new Uint8Array(context.link.romData)

        const romSizePadFactor = Math.max(0, Math.ceil(Math.log(data.length) / Math.log(2) - 15))
        const romSizePadded = 32768 * Math.pow(2, romSizePadFactor)

        if (options.applyHeaderFixes) {
            if (options.fixNintendoLogo) {
                data.set([
                    0xCE, 0xED, 0x66, 0x66, 0xCC, 0x0D, 0x00, 0x0B, 0x03, 0x73, 0x00, 0x83, 0x00, 0x0C, 0x00, 0x0D,
                    0x00, 0x08, 0x11, 0x1F, 0x88, 0x89, 0x00, 0x0E, 0xDC, 0xCC, 0x6E, 0xE6, 0xDD, 0xDD, 0xD9, 0x99,
                    0xBB, 0xBB, 0x67, 0x63, 0x6E, 0x0E, 0xEC, 0xCC, 0xDD, 0xDC, 0x99, 0x9F, 0xBB, 0xB9, 0x33, 0x3E
                ], 0x0104)
            }
            data.set(this.stringBytes(options.gameTitle, '\0', 15), 0x0134)
            if (options.gameId) {
                data.set(this.stringBytes(options.gameId, ' ', 4), 0x013F)
            }
            data[0x0143] =
                options.cgbCompatibility === 'cgb' ? 0xC0 :
                    options.cgbCompatibility === 'both' ? 0x80 :
                        0x00
            data.set(options.licensee.padEnd(2, ' ').substr(0, 2).split('').map((c) => c.charCodeAt(0)), 0x0144)
            data[0x0146] = options.sgbCompatible ? 0x03 : 0x00
            data[0x0147] = options.mbcType & 0xFF
            data[0x0148] = romSizePadFactor & 0xFF
            data[0x0149] = options.ramSize & 0xFF
            data[0x014A] = options.japanese ? 0x00 : 0x01
            data[0x014B] = 0x33
            data[0x014C] = options.gameVersion & 0xFF
        }

        if (options.usePadding) {
            const oldData = data
            data = new Uint8Array(romSizePadded)
            data.fill(options.padding)
            data.set(oldData, 0)
        }

        if (options.applyHeaderFixes) {
            if (options.fixHeaderChecksum) {
                data[0x014D] = data.slice(0x0134, 0x014D).reduce((p, c) => p - c - 1, 0)
            }
            if (options.fixGlobalChecksum) {
                data[0x014E] = 0x00
                data[0x014F] = 0x00
                const checksum = data.reduce((p, c) => p + c, 0)
                data[0x014E] = (checksum & 0xFF00) >>> 8
                data[0x014F] = checksum & 0x00FF
            }
        }

        ctx.romData = data

        return ctx
    }

    private stringBytes(str: string, pad: string, len: number): number[] {
        return str.padEnd(len, pad).substr(0, len).split('').map((c) => c.charCodeAt(0))
    }
}
