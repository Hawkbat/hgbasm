import IObjectSection from './IObjectSection'
import IObjectSymbol from './IObjectSymbol'

export default interface IObjectFile {
    path: string
    symbols: IObjectSymbol[]
    sections: IObjectSection[]
}
