import SymbolType from './SymbolType'

export default interface IObjectSymbol {
    id: number
    name: string
    type: SymbolType
    file: string
    line: number
    sectionId: number
    value: number
}
