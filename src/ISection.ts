
export default interface ISection {
    id: string
    file: string
    startLine: number
    region: string
    bytes: number[]
    fixedAddress?: number
    alignment?: number
    bank?: number
}
