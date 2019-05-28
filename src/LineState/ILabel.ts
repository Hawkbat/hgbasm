import ISymbol from './ISymbol'

export default interface ILabel extends ISymbol {
    section: string
    byteOffset: number
    exported: boolean
}
