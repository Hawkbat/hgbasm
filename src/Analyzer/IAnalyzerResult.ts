import { IAnalyzerResultItem } from './IAnalyzerResultItem'

export default interface IAnalyzerResult {
    sectionSizes: IAnalyzerResultItem[]
    labelOffsets: IAnalyzerResultItem[]
    labelSizes: IAnalyzerResultItem[]
}
