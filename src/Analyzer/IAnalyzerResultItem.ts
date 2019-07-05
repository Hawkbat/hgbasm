import ISymbol from '../LineState/ISymbol'
import InfoDisplayStyle from './InfoDisplayStyle'

export interface IAnalyzerResultItem {
    symbol: ISymbol
    display: InfoDisplayStyle
    value: number
}
