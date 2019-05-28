import ISymbol from './ISymbol'

export default interface ISection extends ISymbol {
    region: string
    bytes: number[]
    fixedAddress?: number
    alignment?: number
    bank?: number
}
