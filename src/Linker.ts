import Compiler from './Compiler'
import CompilerContext from './CompilerContext'
import Diagnostic from './Diagnostic'
import EvaluatorContext from './EvaluatorContext'
import ILabel from './ILabel'
import ILinkerOptions from './ILinkerOptions'
import ISection from './ISection'
import LinkerContext from './LinkerContext'

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

        const regionTypes: { [key: string]: IRegionType | undefined } = {
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

        let sections = context.files.reduce((arr: ISection[], file) => {
            const line = file.lines[file.endLine]
            if (line.eval && line.eval.afterState && line.eval.afterState.sections) {
                arr = arr.concat(Object.values(line.eval.afterState.sections))
            }
            return arr
        }, [])

        sections = sections.sort((a, b) => {
            if (a.region !== b.region) {
                return a.region.localeCompare(b.region)
            }
            const aHasAddr = typeof a.fixedAddress !== 'undefined'
            const bHasAddr = typeof b.fixedAddress !== 'undefined'
            if (aHasAddr && !bHasAddr) {
                return -1
            } else if (!aHasAddr && bHasAddr) {
                return 1
            } else if (aHasAddr && bHasAddr) {
                return a.fixedAddress! - b.fixedAddress!
            }
            const aHasBank = typeof a.bank !== 'undefined'
            const bHasBank = typeof b.bank !== 'undefined'
            if (aHasBank && !bHasBank) {
                return -1
            } else if (!aHasBank && bHasBank) {
                return 1
            } else if (aHasBank && bHasBank) {
                return a.bank! - b.bank!
            }
            const aHasAlign = typeof a.alignment !== 'undefined'
            const bHasAlign = typeof b.alignment !== 'undefined'
            if (aHasAlign && !bHasAlign) {
                return -1
            } else if (!aHasAlign && bHasAlign) {
                return 1
            }
            return a.bytes.length - b.bytes.length
        })

        sections = sections.filter((section) => {
            const type = regionTypes[section.region]
            if (!type) {
                this.error('Invalid memory region', section, ctx)
            } else if (section.bank && !type.banks) {
                this.error('Memory region does not support banking', section, ctx)
            } else if (section.bank && type.banks && section.bank >= type.banks) {
                this.error('Bank number is out of range', section, ctx)
            } else if (section.bank === 0 && type.noBank0) {
                this.error('Memory region does not allow bank 0', section, ctx)
            } else if (typeof section.fixedAddress !== 'undefined' && (section.fixedAddress < type.start || section.fixedAddress > type.end)) {
                this.error('Fixed address is outside of the memory region', section, ctx)
            } else {
                return true
            }
            return false
        })

        const linkSections: ILinkSection[] = []

        for (const section of sections) {
            const link = this.allocate(linkSections, regionTypes, section, ctx)
            if (link) {
                linkSections.push(link)
            }
        }

        linkSections.sort((a, b) => {
            if (a.region === b.region && a.bank !== b.bank) {
                return a.bank - b.bank
            }
            if (a.start !== b.start) {
                return a.start - b.start
            }
            return a.end - b.end
        })

        for (const link of linkSections) {
            this.compiler.logger.log('linkSection', `${link.region}[${link.bank}] ${this.hexString(link.start)} - ${this.hexString(link.end)} = ${link.section.id}`)
        }

        const labels = context.files.reduce((arr: ILabel[], file) => {
            const line = file.lines[file.endLine]
            if (line.eval && line.eval.afterState && line.eval.afterState.labels) {
                arr = arr.concat(Object.values(line.eval.afterState.labels))
            }
            return arr
        }, [])

        if (options.generateSymbolFile) {
            ctx.symbolData = labels.map((label) => {
                const link = linkSections.find((l) => l.section.id === label.section)
                if (link) {
                    return `${this.hexString(link.bank, 2, true)}:${this.hexString(link.start + label.byteOffset, 4, true)} ${label.id}`
                }
                return undefined
            }).sort().filter((label) => label).join('\r\n')
        }

        const romLinks = linkSections.filter((l) => l.region === 'rom0' || l.region === 'romx')
        const totalBanks = romLinks.reduce((p, c) => Math.max(p, c.bank), 0) + 1
        const data = new Uint8Array(ctx.options.disableRomBanks ? 0x8000 : totalBanks * 0x4000)
        data.fill(ctx.options.padding)

        for (const link of romLinks) {
            const index = 0x4000 * link.bank + link.start - (link.region === 'romx' ? 0x4000 : 0x0000)
            this.compiler.logger.log('linkHole', `Filling ${this.hexString(index, 5)} - ${this.hexString(index + link.section.bytes.length - 1, 5)} = ${link.section.id}`)
            data.set(link.section.bytes, index)
        }

        for (const hole of context.holes) {
            const sectionLink = linkSections.find((l) => l.section.id === hole.section)
            const labelEquates: { [key: string]: number } = {}

            if (!hole.line.eval) {
                continue
            }

            if (sectionLink) {
                labelEquates['@'] = sectionLink.start + hole.byteOffset
                labelEquates['@__BANK'] = sectionLink.bank
            }

            for (const label of labels.filter((l) => l.exported || l.file === hole.line.file.getRoot().scope)) {
                const link = linkSections.find((l) => l.section.id === label.section)
                if (link) {
                    labelEquates[label.id] = link.start + label.byteOffset
                    labelEquates[`${label.id}__BANK`] = link.bank
                }
            }
            let val = this.compiler.evaluator.calcConstExpr(hole.node, 'number', new EvaluatorContext(hole.line.eval.options, hole.line, {
                ...hole.line.eval.beforeState,
                file: hole.line.file.getRoot().scope,
                line: hole.line.getLineNumber(),
                numberEquates: {
                    ...(hole.line.eval.beforeState && hole.line.eval.beforeState.numberEquates ? hole.line.eval.beforeState.numberEquates : {}),
                    ...labelEquates
                }
            }))
            if (sectionLink) {
                if (hole.relative) {
                    val = val - (sectionLink.start + hole.byteOffset) - 1
                }
                if (sectionLink.region === 'rom0' || sectionLink.region === 'romx') {
                    const index = 0x4000 * sectionLink.bank + sectionLink.start - (sectionLink.region === 'romx' ? 0x4000 : 0x0000) + hole.byteOffset

                    this.compiler.logger.log('linkHole', `Filling ${this.hexString(index)} - ${this.hexString(index + hole.byteLength - 1)} = ${this.hexString(val, hole.byteLength * 2)} ${hole.line.text.trim()}`)

                    for (let i = 0; i < hole.byteLength; i++) {
                        data[index + i] = val & 0xFF
                        val = val >>> 8
                    }
                }
            }

            ctx.romData = data
        }

        return ctx
    }

    public allocate(linkSections: ILinkSection[], regionTypes: { [key: string]: IRegionType | undefined }, section: ISection, ctx: LinkerContext): ILinkSection | undefined {
        const fixedAddr = typeof section.fixedAddress !== 'undefined'
        const fixedBank = typeof section.bank !== 'undefined'
        const alignment = typeof section.alignment !== 'undefined' ? (1 << section.alignment) : 0
        const region = section.region

        const type = regionTypes[region]
        if (!type) {
            this.error('Invalid memory region', section, ctx)
            return undefined
        }

        let addr = fixedAddr ? section.fixedAddress! : type.start
        let bank = fixedBank ? section.bank! : (type.noBank0 ? 1 : 0)
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
