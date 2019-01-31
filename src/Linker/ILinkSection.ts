import IObjectFile from './IObjectFile'
import IObjectSection from './IObjectSection'
import RegionType from './RegionType'

export default interface ILinkSection {
    region: RegionType
    bank: number
    start: number
    end: number
    section: IObjectSection
    file: IObjectFile
}
