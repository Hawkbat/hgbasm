import PatchType from '../Linker/PatchType'
import Node from './Node'

export default interface IPatch {
    op: Node
    file: string
    line: number
    section: string
    type: PatchType
    offset: number
    expr: number[]
}
