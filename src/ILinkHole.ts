import LineContext from './LineContext'
import Node from './Node'

export default interface ILinkHole {
    line: LineContext
    node: Node
    section: string
    label?: string
    byteOffset: number
    byteLength: number
    relative?: boolean
}
