import CasingStyle from './CasingStyle'

export default interface IFormatterOptions {
    useSpaces: boolean
    tabSize: number
    keywordCase: CasingStyle
    opcodeCase: CasingStyle
    pseudoOpCase: CasingStyle
    conditionCodeCase: CasingStyle
    registerCase: CasingStyle
    functionCase: CasingStyle
    regionCase: CasingStyle
    hexLetterCase: CasingStyle
}
