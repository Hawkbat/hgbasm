import Licensee from './Licensee'
import LicenseeCode from './LicenseeCode'
import MBCType from './MBCType'
import RAMSize from './RAMSize'
import ROMSize from './ROMSize'

export default interface IFixerOptions {
    padding?: number
    cgbCompatibility?: 'dmg' | 'cgb' | 'both'
    sgbCompatible?: boolean
    nintendoLogo?: 'fix' | 'trash'
    headerChecksum?: 'fix' | 'trash'
    globalChecksum?: 'fix' | 'trash'
    japanese?: boolean
    licensee?: string | Licensee | keyof typeof Licensee
    licenseeCode?: number | 'use-licensee' | LicenseeCode | keyof typeof LicenseeCode
    mbcType?: number | MBCType | keyof typeof MBCType
    romSize?: number | 'auto' | ROMSize | keyof typeof ROMSize
    ramSize?: number | RAMSize | keyof typeof RAMSize
    gameId?: string
    gameTitle?: string
    gameVersion?: number
}
