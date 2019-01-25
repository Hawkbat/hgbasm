
export default interface ILabel {
    readonly id: string
    readonly file: string
    readonly line: number
    readonly section: string
    readonly byteOffset: number
    readonly exported: boolean
}
