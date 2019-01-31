import IObjectPatch from './IObjectPatch'

export default interface IObjectSection {
    id: number
    name: string
    region: number
    address: number
    bank: number
    align: number
    data: number[]
    patches: IObjectPatch[]
}
