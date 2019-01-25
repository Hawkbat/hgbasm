import LineContext from './LineContext'
import Node from './Node'

export default interface ILinkHole {
    readonly line: LineContext
    readonly node: Node
    readonly section: string
    readonly byteOffset: number
    readonly byteLength: number
    readonly relative?: boolean
}
