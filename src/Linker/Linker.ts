import BinarySerializer from '../BinarySerializer'
import Diagnostic from '../Diagnostic'
import Logger from '../Logger'
import ExprRules from './ExprRules'
import ExprType from './ExprType'
import ILinkSection from './ILinkSection'
import IObjectPatch from './IObjectPatch'
import IObjectSection from './IObjectSection'
import IObjectSymbol from './IObjectSymbol'
import IRegionTypeMap from './IRegionTypeMap'
import LinkerContext from './LinkerContext'
import PatchType from './PatchType'
import RegionType from './RegionType'
import SymbolType from './SymbolType'

export default class Linker {
    public logger: Logger

    constructor(logger: Logger) {
        this.logger = logger
    }

    public async link(ctx: LinkerContext): Promise<LinkerContext> {
        ctx.regionTypeMap = this.getRegionTypes(ctx)
        ctx.linkSections = []

        const sections = this.getAllSections(ctx)
        let totalBanks = 1

        if (ctx.options.linkerScript) {
            this.applyLinkerScript(sections, ctx)
        }

        for (const section of sections) {
            const link = this.allocate(section, ctx)
            if (link) {
                ctx.linkSections.push(link)
                this.logger.logLine('linkSection', `${RegionType[link.region]}[${link.bank}] ${this.hexString(link.start)} - ${this.hexString(link.end)} = ${link.section.name}`)

                if (link.region === RegionType.rom0 || link.region === RegionType.romx) {
                    totalBanks = Math.max(totalBanks, link.bank + 1)
                }
            }
        }

        if (ctx.options.generateSymbolFile) {
            ctx.symbolFile = this.getSymbolFile(ctx)
        }

        if (ctx.options.generateMapFile) {
            ctx.mapFile = this.getMapFile(ctx)
        }

        let data: Uint8Array

        if (ctx.options.overlay) {
            if (sections.some((s) => s.address < 0 || s.bank < 0)) {
                this.error('All sections must have fixed addresses and banks if using an overlay ROM.', undefined, ctx)
                return ctx
            }
            data = new Uint8Array(ctx.options.overlay)
        } else {
            data = new Uint8Array(ctx.options.disableRomBanks ? 0x8000 : totalBanks * 0x4000)
            data.fill(ctx.options.padding)
        }

        for (const link of ctx.linkSections) {
            if (link.region === RegionType.rom0 || link.region === RegionType.romx) {
                this.fillSection(link, new BinarySerializer(data), ctx)

                for (const patch of link.section.patches) {
                    this.fillPatch(patch, link, new BinarySerializer(data), ctx)
                }
            } else if (link.section.patches.length) {
                this.error('Found patches in a region that cannot be patched', link.section, ctx)
            }
        }

        ctx.romFile = data

        return ctx
    }

    public parseNumber(str: string | undefined): number {
        if (!str) {
            return 0
        }
        if (str.startsWith('$')) {
            return parseInt(str.substr(1), 16)
        } else {
            return parseInt(str, 10)
        }
    }

    public getRegionTypes(ctx: LinkerContext): IRegionTypeMap {
        return {
            [RegionType.rom0]: ctx.options.disableRomBanks ?
                {
                    start: 0x0000,
                    end: 0x7FFF,
                    banks: 1
                } :
                {
                    start: 0x0000,
                    end: 0x3FFF,
                    banks: 1
                },
            [RegionType.romx]: ctx.options.disableRomBanks ?
                undefined :
                {
                    start: 0x4000,
                    end: 0x7FFF,
                    banks: 512,
                    noBank0: true
                },
            [RegionType.vram]: ctx.options.disableVramBanks ?
                {
                    start: 0x8000,
                    end: 0x9FFF,
                    banks: 1
                } :
                {
                    start: 0x8000,
                    end: 0x9FFF,
                    banks: 2
                },
            [RegionType.sram]: {
                start: 0xA000,
                end: 0xBFFF,
                banks: 16
            },
            [RegionType.wram0]: ctx.options.disableWramBanks ?
                {
                    start: 0xC000,
                    end: 0xDFFF,
                    banks: 1
                } :
                {
                    start: 0xC000,
                    end: 0xCFFF,
                    banks: 1
                },
            [RegionType.wramx]: ctx.options.disableWramBanks ?
                undefined :
                {
                    start: 0xD000,
                    end: 0xDFFF,
                    banks: 8,
                    noBank0: true
                },
            [RegionType.oam]: {
                start: 0xFE00,
                end: 0xFE9F,
                banks: 1
            },
            [RegionType.hram]: {
                start: 0xFF80,
                end: 0xFFFE,
                banks: 1
            }
        }
    }

    public getAllSections(ctx: LinkerContext): IObjectSection[] {
        let sections: IObjectSection[] = []
        for (const file of ctx.objectFiles) {
            for (const section of file.sections) {
                ctx.sectionFileMap[section.name] = file
                sections.push(section)
            }
        }

        sections = sections.filter((section) => {
            const type = ctx.regionTypeMap[section.region]
            if (!type) {
                this.error('Invalid memory region', section, ctx)
            } else if (section.bank >= 0 && type.banks === 1) {
                this.error('Memory region does not support banking', section, ctx)
            } else if (section.bank >= 0 && section.bank >= type.banks) {
                this.error('Bank number is out of range', section, ctx)
            } else if (section.bank === 0 && type.noBank0) {
                this.error('Memory region does not allow bank 0', section, ctx)
            } else if (section.address >= 0 && (section.address < type.start || section.address > type.end)) {
                this.error('Fixed address is outside of the memory region', section, ctx)
            } else {
                return true
            }
            return false
        })

        sections = sections.sort((a, b) => {
            if (a.region !== b.region) {
                return b.region - a.region
            }
            const aHasAddr = a.address >= 0
            const bHasAddr = b.address >= 0
            if (aHasAddr && !bHasAddr) {
                return -1
            } else if (!aHasAddr && bHasAddr) {
                return 1
            } else if (aHasAddr && bHasAddr) {
                return a.address - b.address
            }
            const aHasBank = a.bank >= 0
            const bHasBank = b.bank >= 0
            if (aHasBank && !bHasBank) {
                return -1
            } else if (!aHasBank && bHasBank) {
                return 1
            } else if (aHasBank && bHasBank) {
                return a.bank - b.bank
            }
            const aHasAlign = a.align >= 0
            const bHasAlign = b.align >= 0
            if (aHasAlign && !bHasAlign) {
                return -1
            } else if (!aHasAlign && bHasAlign) {
                return 1
            }
            return a.size - b.size
        })
        return sections
    }

    public getSymbolFile(ctx: LinkerContext): string {
        const symbolMap: { [key: number]: { symbol: IObjectSymbol, link: ILinkSection } } = {}
        for (const file of ctx.objectFiles) {
            for (const symbol of file.symbols) {
                if (symbol.type === SymbolType.Imported || symbol.name === '@') {
                    continue
                }
                const link = ctx.linkSections.find((l) => l.section === file.sections[symbol.sectionId])
                if (link) {
                    symbolMap[link.bank * 0x10000 + link.start + symbol.value] = { symbol, link }
                }
            }
        }
        return Object.values(symbolMap).map((s) => `${this.hexString(s.link.bank, 2, true)}:${this.hexString(s.link.start + s.symbol.value, 4, true)} ${s.symbol.name}`).sort().join('\n')
    }

    public getMapFile(ctx: LinkerContext): string {
        let result: string = ''
        const regionList = [RegionType.rom0, RegionType.romx, RegionType.wram0, RegionType.wramx, RegionType.vram, RegionType.oam, RegionType.hram, RegionType.sram]
        for (const region of regionList) {
            const type = ctx.regionTypeMap[region]
            if (!type) {
                continue
            }
            let lastBank = type.banks - 1
            if (region === RegionType.romx) {
                lastBank = ctx.linkSections.map((l) => l.bank).reduce((p, c) => Math.max(p, c))
            }
            for (let bank = type.noBank0 ? 1 : 0; bank <= lastBank; bank++) {
                if (region === RegionType.rom0) {
                    result += `ROM Bank #${bank} (HOME):\n`
                } else if (region === RegionType.romx) {
                    result += `ROM Bank #${bank}:\n`
                } else if (region === RegionType.wram0 || region === RegionType.wramx) {
                    result += `WRAM Bank #${bank}:\n`
                } else if (region === RegionType.vram) {
                    result += `VRAM Bank #${bank}:\n`
                } else if (region === RegionType.oam) {
                    result += `OAM:\n`
                } else if (region === RegionType.hram) {
                    result += `HRAM:\n`
                } else if (region === RegionType.sram) {
                    result += `SRAM Bank #${bank}:\n`
                }

                const links = ctx.linkSections.filter((l) => l.region === region && l.bank === bank).sort((a, b) => a.start - b.start)
                if (links.length > 0) {
                    let size = type.end - type.start + 1
                    for (const link of links) {
                        result += `  SECTION: ${this.hexString(link.start)}-${this.hexString(link.end)} (${this.hexString(link.end - link.start + 1)} bytes) ["${link.section.name}"]\n`
                        const symbols = link.file.symbols.filter((s) => link.section === link.file.sections[s.sectionId]).sort((a, b) => a.value - b.value)
                        for (const symbol of symbols) {
                            if (symbol.name === '@') {
                                continue
                            }
                            result += `           ${this.hexString(link.start + symbol.value)} = ${symbol.name}\n`
                        }
                        size -= (link.end - link.start + 1)
                    }
                    result += `    SLACK: ${this.hexString(size)} bytes\n`
                } else {
                    result += `  EMPTY\n`
                }
                result += '\n'
            }
        }
        return result
    }

    public calcPatchValue(patch: IObjectPatch, link: ILinkSection, ctx: LinkerContext): number {
        const bs = new BinarySerializer(patch.expr)
        const values: number[] = []

        while (!bs.reachedEnd()) {
            ExprRules[bs.readByte() as ExprType](values, bs, patch, link, ctx, this)
        }

        if (values.length !== 1) {
            this.error(`Invalid link expression at ${patch.file} (${patch.line})`, link.section, ctx)
            return 0
        }

        return values[0]
    }

    public fillSection(link: ILinkSection, bs: BinarySerializer, ctx: LinkerContext): void {
        if (link.region !== RegionType.rom0 && link.region !== RegionType.romx) {
            this.error('Tried to fill section in region other than ROM', link.section, ctx)
            return
        }
        const index = 0x4000 * link.bank + link.start - (link.region === RegionType.romx ? 0x4000 : 0x0000)
        this.logger.logLine('linkPatch', `Filling ${this.hexString(index, 5)} - ${this.hexString(index + link.section.data.length - 1, 5)} = ${link.section.name} `)
        bs.index = index
        bs.writeBytes(link.section.data)
    }

    public fillPatch(patch: IObjectPatch, link: ILinkSection, bs: BinarySerializer, ctx: LinkerContext): void {
        const val = this.calcPatchValue(patch, link, ctx)
        const index = 0x4000 * link.bank + link.start - (link.region === RegionType.romx ? 0x4000 : 0x0000) + patch.offset
        const address = link.start + patch.offset

        this.logger.logLine('linkPatch', `Filling ${this.hexString(index)} = ${this.hexString(val)}`)

        bs.index = index
        if (patch.type === PatchType.byte) {
            if (val < -0x80 || val > 0xFF) {
                this.error(`Calculated value (${this.hexString(val, 2)}) at ${patch.file}(${patch.line}) does not fit in 8 bits`, link.section, ctx)
            }
            bs.writeByte(val)
        } else if (patch.type === PatchType.word) {
            if (val < -0x8000 || val > 0xFFFF) {
                this.error(`Calculated value (${this.hexString(val, 4)}) at ${patch.file}(${patch.line}) does not fit in 16 bits`, link.section, ctx)
            }
            bs.writeShort(val)
        } else if (patch.type === PatchType.long) {
            if (val < -0x80000000 || val > 0xFFFFFFFF) {
                this.error(`Calculated value (${this.hexString(val, 8)}) at ${patch.file}(${patch.line}) does not fit in 32 bits`, link.section, ctx)
            }
            bs.writeLong(val)
        } else if (patch.type === PatchType.jr) {
            const result = val - (address + 2 - 1)
            if (result < -0x80 || result > 0x7F) {
                this.error(`Calculated jump offset (${this.hexString(result, 2)}) at ${patch.file}(${patch.line}) does not fit in signed 8-bit range; try using JP instead`, link.section, ctx)
            }
            bs.writeByte(result)
        }
    }

    public applyLinkerScript(sections: IObjectSection[], ctx: LinkerContext): void {
        const lines = ctx.options.linkerScript.split(/\r?\n/g)

        const addrs: { [key: string]: number } = {}
        let region = RegionType.rom0
        let bank = 0
        let addrKey = ''

        for (const line of lines) {
            const bits = []
            let next = ''
            let inString = false
            for (const c of line) {
                if (inString) {
                    if (c === '"') {
                        inString = false
                        next += c
                        if (next) {
                            bits.push(next)
                        }
                        next = ''
                    } else {
                        next += c
                    }
                } else {
                    if (!inString && c === '"') {
                        if (next) {
                            bits.push(next)
                        }
                        next = c
                        inString = true
                    } else if (c === ';') {
                        break
                    } else if (c.trim()) {
                        next += c
                    } else {
                        if (next) {
                            bits.push(next)
                        }
                        next = ''
                    }
                }
            }
            if (next) {
                bits.push(next)
            }

            bits.reverse()

            while (bits.length) {
                let bit = bits.pop()
                if (!bit) {
                    break
                }
                if (RegionType[bit.toLowerCase() as keyof typeof RegionType]) {
                    region = RegionType[bit.toLowerCase() as keyof typeof RegionType]
                    const regionType = ctx.regionTypeMap[region]
                    if (regionType) {
                        bank = this.parseNumber(bits.pop())
                        addrKey = `${region}[${bank}]`
                        addrs[addrKey] = addrs[addrKey] ? addrs[addrKey] : regionType.start
                    } else {
                        this.error(`Invalid region type "${bit}"`, undefined, ctx)
                    }
                } else if (bit.startsWith('"')) {
                    bit = bit.substr(1, bit.length - 2)
                    const section = sections.find((s) => s.name === bit)
                    if (section) {
                        section.address = addrs[addrKey]
                        section.region = region
                        section.bank = bank
                        addrs[addrKey] += section.size
                    } else {
                        this.error(`No matching section named "${bit}" found`, undefined, ctx)
                    }
                } else if (bit.toLowerCase() === 'org') {
                    addrs[addrKey] = this.parseNumber(bits.pop())
                } else if (bit.toLowerCase() === 'align') {
                    const alignment = 1 << this.parseNumber(bits.pop())
                    if (alignment > 0 && (addrs[addrKey] % alignment) !== 0) {
                        addrs[addrKey] += alignment - (addrs[addrKey] % alignment)
                    }
                } else if (bit.toLowerCase() === 'include') {
                    this.error('Include not yet implemented in linker scripts', undefined, ctx)
                }
            }
        }
    }

    public allocate(section: IObjectSection, ctx: LinkerContext): ILinkSection | undefined {
        const file = ctx.sectionFileMap[section.name]
        const fixedAddr = section.address >= 0
        const fixedBank = section.bank >= 0
        const alignment = section.align >= 0 ? (1 << section.align) : 0
        const region = section.region
        const type = ctx.regionTypeMap[region]

        if (!type) {
            this.error('Invalid memory region', section, ctx)
            return undefined
        }

        let addr = fixedAddr ? section.address : type.start
        let bank = fixedBank ? section.bank : (type.noBank0 ? 1 : 0)

        if (fixedAddr && fixedBank) {
            return {
                region,
                start: addr,
                end: addr + section.size - 1,
                bank,
                section,
                file
            }
        }

        while (true) {
            if (!fixedAddr && alignment > 0 && (addr % alignment) !== 0) {
                addr += alignment - (addr % alignment)
            }
            const overlaps = ctx.linkSections.filter((s) => {
                if (s.bank !== bank || s.region !== region) {
                    return false
                }
                const x0 = addr
                const x1 = addr + section.size - 1
                const y0 = s.start
                const y1 = s.end
                return x1 >= y0 && y1 >= x0
            })
            if (overlaps.length) {
                if (!fixedAddr) {
                    addr = overlaps.reduce((p, s) => Math.max(p, s.end), addr) + 1
                    if (alignment > 0 && (addr % alignment) !== 0) {
                        addr += alignment - (addr % alignment)
                    }
                }
                if (addr + section.size - 1 > type.end || fixedAddr) {
                    if (bank >= type.banks - 1) {
                        this.error('Not enough room left in any bank', section, ctx)
                        return undefined
                    } else if (fixedBank) {
                        this.error('Not enough room in specified bank', section, ctx)
                        return undefined
                    } else {
                        bank++
                        addr = fixedAddr ? section.address : type.start
                    }
                }
            } else {
                return {
                    region,
                    start: addr,
                    end: addr + section.size - 1,
                    bank,
                    section,
                    file
                }
            }
        }
    }

    public error(msg: string, section: IObjectSection | undefined, ctx: LinkerContext): void {
        ctx.diagnostics.push(new Diagnostic('Linker', `${msg}${section ? ` at section "${section.name}"` : ''} `, 'error'))
    }

    private hexString(n: number, len: number = 4, noSymbol: boolean = false): string {
        return `${n < 0 ? '-' : ''}${noSymbol ? '' : '$'}${Math.abs(n).toString(16).toUpperCase().padStart(len, '0')}`
    }
}
