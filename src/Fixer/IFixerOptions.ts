
export default interface IFixerOptions {
    cgbCompatibility?: 'dmg' | 'cgb' | 'both'
    sgbCompatible?: boolean
    nintendoLogo?: 'fix' | 'trash'
    headerChecksum?: 'fix' | 'trash'
    globalChecksum?: 'fix' | 'trash'
    japanese?: boolean
    licensee?: string
    licenseeCode?: number
    mbcType?: number
    ramSize?: number
    gameId?: string
    gameTitle?: string
    gameVersion?: number
    padding?: number
}
