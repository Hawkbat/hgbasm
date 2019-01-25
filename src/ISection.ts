
export default interface ISection {
    readonly id: string
    readonly file: string
    readonly startLine: number
    readonly region: string
    readonly bytes: ReadonlyArray<number>
    readonly fixedAddress?: number
    readonly alignment?: number
    readonly bank?: number
}
