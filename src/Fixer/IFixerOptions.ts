import Licensee from './Licensee'
import LicenseeCode from './LicenseeCode'
import MBCType from './MBCType'
import RAMSize from './RAMSize'
import ROMSize from './ROMSize'

export default interface IFixerOptions {
    cgbCompatibility?: 'dmg' | 'cgb' | 'both'
    sgbCompatible?: boolean
    nintendoLogo?: 'fix' | 'trash'
    headerChecksum?: 'fix' | 'trash'
    globalChecksum?: 'fix' | 'trash'
    japanese?: boolean
    licensee?: string | Licensee
    licenseeCode?: number | LicenseeCode
    mbcType?: number | MBCType
    romSize?: number | ROMSize | 'auto'
    ramSize?: number | RAMSize
    gameId?: string
    gameTitle?: string
    gameVersion?: number
    padding?: number
}
