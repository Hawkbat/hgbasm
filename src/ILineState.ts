import IConditional from './IConditional'
import ILabel from './ILabel'
import IMacro from './IMacro'
import IMacroCall from './IMacroCall'
import IOptions from './IOptions'
import IRepeat from './IRepeat'
import ISection from './ISection'
import IUnion from './IUnion'

export default interface ILineState {
    file: string
    line: number
    sections?: { [key: string]: ISection }
    labels?: { [key: string]: ILabel }
    numberEquates?: { [key: string]: number }
    stringEquates?: { [key: string]: string }
    sets?: { [key: string]: number }
    macros?: { [key: string]: IMacro }
    charmaps?: { [key: string]: number }
    inSections?: string[]
    inUnions?: IUnion[]
    inRepeats?: IRepeat[]
    inConditionals?: IConditional[]
    inMacroCalls?: IMacroCall[]
    options?: IOptions[]
    rsCounter?: number
    macroCounter?: number
    inLabel?: string
    inMacro?: string
}
