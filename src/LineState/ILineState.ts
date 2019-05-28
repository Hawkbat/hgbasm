import IConditional from './IConditional'
import ILabel from './ILabel'
import IMacro from './IMacro'
import IMacroCall from './IMacroCall'
import IMacroDefine from './IMacroDefine'
import INumberEquate from './INumberEquate'
import IOptions from './IOptions'
import IRepeat from './IRepeat'
import ISection from './ISection'
import ISet from './ISet'
import IStringEquate from './IStringEquate'
import IUnion from './IUnion'

export default interface ILineState {
    file: string
    line: number
    sections?: { [key: string]: ISection }
    labels?: { [key: string]: ILabel }
    numberEquates?: { [key: string]: INumberEquate }
    stringEquates?: { [key: string]: IStringEquate }
    sets?: { [key: string]: ISet }
    macros?: { [key: string]: IMacro }
    charmaps?: { [key: string]: number }
    inSections?: string[]
    inUnions?: IUnion[]
    inRepeats?: IRepeat[]
    inConditionals?: IConditional[]
    inMacroCalls?: IMacroCall[]
    inMacroDefines?: IMacroDefine[]
    options?: IOptions[]
    rsCounter?: number
    macroCounter?: number
    inGlobalLabel?: string
    inLabel?: string
}
