import Compiler from './Compiler'
import CompilerContext from './CompilerContext'
import Diagnostic from './Diagnostic'
import EvaluatorContext from './EvaluatorContext'
import ILabel from './ILabel'
import ILineState from './ILineState'
import ILinkerOptions from './ILinkerOptions'
import ILinkHole from './ILinkHole'
import ISection from './ISection'
import LinkerContext from './LinkerContext'
import Token from './Token'
import TokenType from './TokenType'

interface IRegionType {
    start: number
    end: number
    banks: number
    noBank0?: boolean
}

interface ILinkSection {
    region: string
    bank: number
    start: number
    end: number
    section: ISection
}

export default class Linker {

    constructor(public compiler: Compiler) {

    }

    public link(context: CompilerContext, options: ILinkerOptions): LinkerContext {
        const ctx = new LinkerContext(options, context)

        const regionTypes = this.getRegionTypes(ctx)
        const labels = this.getAllLabels(ctx)
        const sections = this.getAllSections(regionTypes, ctx)

        const linkSections: ILinkSection[] = []
        const linkSectionMap: { [key: string]: ILinkSection | undefined } = {}
        let totalBanks = 1

        if (options.linkerScript) {
            const lines = options.linkerScript.split(/\r?\n/g)
            let lineNumber = 0

            const addrs: { [key: string]: number } = {}
            let region = ''
            let bank = 0
            let addrKey = ''

            for (const line of lines) {
                const tokens = this.compiler.lexer.lexString(line, lineNumber++).filter((t) => t.type !== TokenType.space && t.type !== TokenType.escape && t.type !== TokenType.interp && t.type !== TokenType.comment && t.type !== TokenType.start_of_line && t.type !== TokenType.end_of_line).reverse()
                while (tokens.length) {
                    const token = tokens.pop()!
                    if (token.type === TokenType.region) {
                        region = token.value.toLowerCase()
                        bank = this.parseNumberToken(tokens.pop())
                        addrKey = `${region}[${bank}]`
                        addrs[addrKey] = addrs[addrKey] ? addrs[addrKey] : regionTypes[region]!.start
                    } else if (token.type === TokenType.string) {
                        const section = sections.find((s) => s.id === token.value.substr(1, token.value.length - 2))
                        if (section) {
                            section.fixedAddress = addrs[addrKey]
                            section.region = region
                            section.bank = bank
                            addrs[addrKey] += section.bytes.length
                        }
                    } else if (token.value.toLowerCase() === 'org') {
                        addrs[addrKey] = this.parseNumberToken(tokens.pop())
                    } else if (token.value.toLowerCase() === 'align') {
                        const alignment = 1 << this.parseNumberToken(tokens.pop())
                        if (alignment > 0 && (addrs[addrKey] % alignment) !== 0) {
                            addrs[addrKey] += alignment - (addrs[addrKey] % alignment)
                        }
                    } else if (token.value.toLowerCase() === 'include') {
                        throw new Error('Include not yet implemented in linker scripts')
                    }
                }
            }
        }

        for (const section of sections) {
            const link = this.allocate(linkSections, regionTypes, section, ctx)
            if (link) {
                linkSections.push(link)
                linkSectionMap[section.id] = link
                this.compiler.logger.log('linkSection', `${link.region}[${link.bank}] ${this.hexString(link.start)} - ${this.hexString(link.end)} = ${link.section.id}`)

                if (link.region === 'rom0' || link.region === 'romx') {
                    totalBanks = Math.max(totalBanks, link.bank + 1)
                }
            }
        }

        if (options.generateSymbolFile) {
            ctx.symbolData = this.getSymbolData(labels, linkSectionMap)
        }

        const data = new Uint8Array(ctx.options.disableRomBanks ? 0x8000 : totalBanks * 0x4000)
        data.fill(ctx.options.padding)

        for (const link of linkSections) {
            this.fillLinkSection(link, data)
        }

        for (const hole of context.holes) {
            this.fillHole(hole, labels, linkSectionMap, data)
        }

        ctx.romData = data

        return ctx
    }

    public parseNumberToken(t: Token | undefined): number {
        if (t && t.type === TokenType.decimal_number) {
            return parseInt(t.value, 10)
        } else if (t && t.type === TokenType.hex_number) {
            return parseInt(t.value.substr(1), 16)
        } else {
            return 0
        }
    }

    public getRegionTypes(ctx: LinkerContext): { [key: string]: IRegionType | undefined } {
        return {
            rom0: ctx.options.disableRomBanks ?
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
            romx: ctx.options.disableRomBanks ?
                undefined :
                {
                    start: 0x4000,
                    end: 0x7FFF,
                    banks: 512,
                    noBank0: true
                },
            vram: ctx.options.disableVramBanks ?
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
            sram: {
                start: 0xA000,
                end: 0xBFFF,
                banks: 16
            },
            wram0: ctx.options.disableWramBanks ?
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
            wramx: ctx.options.disableWramBanks ?
                undefined :
                {
                    start: 0xD000,
                    end: 0xDFFF,
                    banks: 8,
                    noBank0: true
                },
            oam: {
                start: 0xFE00,
                end: 0xFE9F,
                banks: 1
            },
            hram: {
                start: 0xFF80,
                end: 0xFFFE,
                banks: 1
            }
        }
    }

    public getAllLabels(ctx: LinkerContext): ILabel[] {
        return ctx.context.files.reduce((arr: ILabel[], file) => {
            const line = file.lines[file.endLine]
            if (line.eval && line.eval.state && line.eval.state.labels) {
                arr = arr.concat(Object.values(line.eval.state.labels))
            }
            return arr
        }, [])
    }

    public getAllSections(regionTypes: { [key: string]: IRegionType | undefined }, ctx: LinkerContext): ISection[] {
        let sections = ctx.context.files.reduce((arr: ISection[], file) => {
            const line = file.lines[file.endLine]
            if (line.eval && line.eval.state && line.eval.state.sections) {
                arr = arr.concat(Object.values(line.eval.state.sections))
            }
            return arr
        }, [])

        sections = sections.filter((section) => {
            const type = regionTypes[section.region]
            if (!type) {
                this.error('Invalid memory region', section, ctx)
            } else if (section.bank && type.banks === 1) {
                this.error('Memory region does not support banking', section, ctx)
            } else if (section.bank && section.bank >= type.banks) {
                this.error('Bank number is out of range', section, ctx)
            } else if (section.bank === 0 && type.noBank0) {
                this.error('Memory region does not allow bank 0', section, ctx)
            } else if (section.fixedAddress !== undefined && (section.fixedAddress < type.start || section.fixedAddress > type.end)) {
                this.error('Fixed address is outside of the memory region', section, ctx)
            } else {
                return true
            }
            return false
        })

        sections = sections.sort((a, b) => {
            if (a.region !== b.region) {
                return a.region.localeCompare(b.region)
            }
            const aHasAddr = a.fixedAddress !== undefined
            const bHasAddr = b.fixedAddress !== undefined
            if (aHasAddr && !bHasAddr) {
                return -1
            } else if (!aHasAddr && bHasAddr) {
                return 1
            } else if (aHasAddr && bHasAddr) {
                return a.fixedAddress! - b.fixedAddress!
            }
            const aHasBank = a.bank !== undefined
            const bHasBank = b.bank !== undefined
            if (aHasBank && !bHasBank) {
                return -1
            } else if (!aHasBank && bHasBank) {
                return 1
            } else if (aHasBank && bHasBank) {
                return a.bank! - b.bank!
            }
            const aHasAlign = a.alignment !== undefined
            const bHasAlign = b.alignment !== undefined
            if (aHasAlign && !bHasAlign) {
                return -1
            } else if (!aHasAlign && bHasAlign) {
                return 1
            }
            return a.bytes.length - b.bytes.length
        })
        return sections
    }

    public getSymbolData(labels: ILabel[], linkSectionMap: { [key: string]: ILinkSection | undefined }): string {
        return labels.map((label) => {
            const link = linkSectionMap[label.section]
            if (link) {
                return `${this.hexString(link.bank, 2, true)}:${this.hexString(link.start + label.byteOffset, 4, true)} ${label.id}`
            }
            return undefined
        }).sort().filter((label) => label).join('\r\n')
    }

    public fillLinkSection(link: ILinkSection, data: Uint8Array): void {
        if (link.region !== 'rom0' && link.region !== 'romx') {
            return
        }
        const index = 0x4000 * link.bank + link.start - (link.region === 'romx' ? 0x4000 : 0x0000)
        this.compiler.logger.log('linkHole', `Filling ${this.hexString(index, 5)} - ${this.hexString(index + link.section.bytes.length - 1, 5)} = ${link.section.id}`)
        data.set(link.section.bytes, index)
    }

    public getHoleLabelEquates(hole: ILinkHole, sectionLink: ILinkSection, labels: ILabel[], linkSectionMap: { [key: string]: ILinkSection | undefined }): { [key: string]: number } {
        const labelEquates: { [key: string]: number } = {}

        for (const label of labels) {
            if (!label.exported && label.file !== hole.line.file.getRoot().scope) {
                continue
            }
            const labelId = label.id.indexOf('.') >= 0 ? label.id.substr(label.id.indexOf('.')) : label.id
            if (hole.line.text.indexOf(labelId) === -1) {
                continue
            }
            const link = linkSectionMap[label.section]
            if (link) {
                labelEquates[label.id] = link.start + label.byteOffset
                labelEquates[`${label.id}__BANK`] = link.bank
            }
        }

        labelEquates['@'] = sectionLink.start + hole.byteOffset
        labelEquates['@__BANK'] = sectionLink.bank

        return labelEquates
    }

    public getHoleState(hole: ILinkHole, labelEquates: { [key: string]: number }): ILineState | undefined {
        if (!hole.line.eval) {
            return undefined
        }
        return {
            ...hole.line.eval.state,
            file: hole.line.file.getRoot().scope,
            line: hole.line.getLineNumber(),
            inLabel: hole.label,
            numberEquates: {
                ...(hole.line.eval.state && hole.line.eval.state.numberEquates ? hole.line.eval.state.numberEquates : {}),
                ...labelEquates
            }
        }
    }

    public getHoleValue(hole: ILinkHole, sectionLink: ILinkSection, labelEquates: { [key: string]: number }): number {
        if (!hole.line.eval) {
            return 0
        }
        let val = this.compiler.evaluator.calcConstExpr(hole.node, 'number', new EvaluatorContext(hole.line.eval.options, hole.line, this.getHoleState(hole, labelEquates)))
        if (sectionLink) {
            if (hole.relative) {
                val = val - (sectionLink.start + hole.byteOffset) - 1
            }
        }
        return val
    }

    public fillHole(hole: ILinkHole, labels: ILabel[], linkSectionMap: { [key: string]: ILinkSection | undefined }, data: Uint8Array): void {
        const sectionLink = linkSectionMap[hole.section]
        if (!sectionLink || (sectionLink.region !== 'rom0' && sectionLink.region !== 'romx')) {
            return
        }

        const labelEquates = this.getHoleLabelEquates(hole, sectionLink, labels, linkSectionMap)
        let val = this.getHoleValue(hole, sectionLink, labelEquates)

        const index = 0x4000 * sectionLink.bank + sectionLink.start - (sectionLink.region === 'romx' ? 0x4000 : 0x0000) + hole.byteOffset

        this.compiler.logger.log('linkHole', `Filling ${this.hexString(index)} - ${this.hexString(index + hole.byteLength - 1)} = ${this.hexString(val, hole.byteLength * 2)} ${hole.line.text.trim()}`)

        for (let i = 0; i < hole.byteLength; i++) {
            data[index + i] = val & 0xFF
            val = val >>> 8
        }
    }

    public allocate(linkSections: ILinkSection[], regionTypes: { [key: string]: IRegionType | undefined }, section: ISection, ctx: LinkerContext): ILinkSection | undefined {
        const fixedAddr = section.fixedAddress !== undefined
        const fixedBank = section.bank !== undefined
        const alignment = section.alignment !== undefined ? (1 << section.alignment) : 0
        const region = section.region

        const type = regionTypes[region]
        if (!type) {
            this.error('Invalid memory region', section, ctx)
            return undefined
        }

        let addr = fixedAddr ? section.fixedAddress! : type.start
        let bank = fixedBank ? section.bank! : (type.noBank0 ? 1 : 0)

        if (fixedAddr && fixedBank) {
            return {
                region,
                start: addr,
                end: addr + section.bytes.length - 1,
                bank,
                section
            }
        }

        while (true) {
            if (!fixedAddr && alignment > 0 && (addr % alignment) !== 0) {
                addr += alignment - (addr % alignment)
            }
            const overlaps = linkSections.filter((s) => {
                if (s.bank !== bank || s.region !== region) {
                    return false
                }
                const x0 = addr
                const x1 = addr + section.bytes.length - 1
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
                if (addr + section.bytes.length - 1 > type.end || fixedAddr) {
                    if (bank >= type.banks - 1) {
                        this.error('Not enough room left in any bank', section, ctx)
                        return undefined
                    } else if (fixedBank) {
                        this.error('Not enough room in specified bank', section, ctx)
                        return undefined
                    } else {
                        bank++
                        addr = fixedAddr ? section.fixedAddress! : type.start
                    }
                }
            } else {
                return {
                    region,
                    start: addr,
                    end: addr + section.bytes.length - 1,
                    bank,
                    section
                }
            }
        }
    }

    public error(msg: string, section: ISection, ctx: LinkerContext): void {
        if (section) {
            const file = ctx.context.files.find((f) => f.source.path === section.file)
            if (file) {
                const line = file.lines[section.startLine]
                if (line && line.parse && line.parse.node && line.parse.node.children.length) {
                    ctx.context.diagnostics.push(new Diagnostic('Linker', msg, 'error', undefined, line))
                }
            }
        }
    }

    private hexString(n: number, len: number = 4, noSymbol: boolean = false): string {
        return `${n < 0 ? '-' : ''}${noSymbol ? '' : '$'}${Math.abs(n).toString(16).toUpperCase().padStart(len, '0')}`
    }
}
