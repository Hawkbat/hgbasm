import BinarySerializer from './BinarySerializer'
import IObjectFile from './Linker/IObjectFile'
import IObjectPatch from './Linker/IObjectPatch'
import IObjectSection from './Linker/IObjectSection'
import IObjectSymbol from './Linker/IObjectSymbol'
import RegionType from './Linker/RegionType'
import SymbolType from './Linker/SymbolType'

export function writeObjectFile(obj: IObjectFile): Uint8Array {
    const bin: number[] = []
    const s = new BinarySerializer(bin)
    s.writeChars('RGB6')
    s.writeLong(obj.symbols.length)
    s.writeLong(obj.sections.length)
    for (const symbol of obj.symbols) {
        s.writeString(symbol.name)
        s.writeByte(symbol.type)
        if (symbol.type !== SymbolType.Imported) {
            s.writeString(symbol.file)
            s.writeLong(symbol.line)
            s.writeLong(symbol.sectionId)
            s.writeLong(symbol.value)
        }
    }
    for (const section of obj.sections) {
        s.writeString(section.name)
        s.writeLong(section.data ? section.data.length : 0)
        s.writeByte(section.region)
        s.writeLong(section.address)
        s.writeLong(section.bank)
        s.writeLong(section.align)
        if (section.region === RegionType.rom0 || section.region === RegionType.romx) {
            s.writeBytes(section.data)
            s.writeLong(section.patches.length)
            for (const patch of section.patches) {
                s.writeString(patch.file)
                s.writeLong(patch.line)
                s.writeLong(patch.offset)
                s.writeByte(patch.type)
                s.writeLong(patch.expr.length)
                s.writeBytes(patch.expr)
            }
        }
    }
    return new Uint8Array(bin)
}

export function readObjectFile(path: string, bin: Uint8Array): IObjectFile {
    const symbols: IObjectSymbol[] = []
    const sections: IObjectSection[] = []

    const s = new BinarySerializer(bin)
    const typeId = s.readChars(4)
    if (typeId !== 'RGB6') {
        throw Error(`Unknown object file type at ${path}`)
    }
    const symbolCount = s.readLong()
    const sectionCount = s.readLong()
    for (let i = 0; i < symbolCount; i++) {
        const id = i
        const name = s.readString()
        const type = s.readByte()
        const file = type !== 1 ? s.readString() : ''
        const line = type !== 1 ? s.readLong() : -1
        const sectionId = type !== 1 ? s.readLong() : -1
        const value = type !== 1 ? s.readLong() : -1
        symbols.push({
            id,
            name,
            type,
            file,
            line,
            sectionId,
            value
        })
    }
    for (let i = 0; i < sectionCount; i++) {
        const id = i
        const name = s.readString()
        const size = s.readLong()
        const region = s.readByte()
        const address = s.readLong()
        const bank = s.readLong()
        const align = s.readLong()
        let data: number[] = []
        let patches: IObjectPatch[] = []
        if (region === RegionType.rom0 || region === RegionType.romx) {
            data = s.readBytes(size)
            const patchCount = s.readLong()
            patches = []
            for (let j = 0; j < patchCount; j++) {
                const file = s.readString()
                const line = s.readLong()
                const offset = s.readLong()
                const type = s.readByte()
                const exprSize = s.readLong()
                const expr = s.readBytes(exprSize)
                patches.push({
                    file,
                    line,
                    offset,
                    type,
                    expr
                })
            }
        }
        sections.push({
            id,
            name,
            region,
            address,
            bank,
            align,
            data,
            patches
        })
    }
    return {
        path,
        symbols,
        sections
    }
}
