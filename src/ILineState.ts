import IConditional from './IConditional'
import ILabel from './ILabel'
import IMacro from './IMacro'
import IMacroCall from './IMacroCall'
import IMap from './IMap'
import IOptions from './IOptions'
import IRepeat from './IRepeat'
import ISection from './ISection'
import IUnion from './IUnion'

export default interface ILineState {
    readonly file: string
    readonly line: number
    readonly sections?: IMap<ISection>
    readonly labels?: IMap<ILabel>
    readonly numberEquates?: IMap<number>
    readonly stringEquates?: IMap<string>
    readonly sets?: IMap<number>
    readonly macros?: IMap<IMacro>
    readonly charmaps?: IMap<number>
    readonly rsCounter?: number
    readonly macroCounter?: number
    readonly inLabel?: string
    readonly inMacro?: string
    readonly inSections?: ReadonlyArray<string>
    readonly inUnions?: ReadonlyArray<IUnion>
    readonly inRepeats?: ReadonlyArray<IRepeat>
    readonly inConditionals?: ReadonlyArray<IConditional>
    readonly inMacroCalls?: ReadonlyArray<IMacroCall>
    readonly options?: ReadonlyArray<IOptions>
}
