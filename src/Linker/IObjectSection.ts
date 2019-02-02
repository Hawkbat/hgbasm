import IObjectPatch from './IObjectPatch'

export default interface IObjectSection {
    id: number
    name: string
    size: number
    region: number
    address: number
    bank: number
    align: number
    data: number[]
    patches: IObjectPatch[]
}
