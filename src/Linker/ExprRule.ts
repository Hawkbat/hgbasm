import BinarySerializer from '../BinarySerializer'
import ILinkSection from './ILinkSection'
import IObjectPatch from './IObjectPatch'
import Linker from './Linker'
import LinkerContext from './LinkerContext'

type ExprRule = (values: number[], bs: BinarySerializer, patch: IObjectPatch, link: ILinkSection, ctx: LinkerContext, linker: Linker) => void

export default ExprRule
