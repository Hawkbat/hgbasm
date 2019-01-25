
export default interface IFixerOptions {
    applyHeaderFixes: boolean
    cgbCompatibility: 'dmg' | 'cgb' | 'both'
    sgbCompatible: boolean
    fixNintendoLogo: boolean
    fixHeaderChecksum: boolean
    fixGlobalChecksum: boolean
    japanese: boolean
    licensee: string
    licenseeCode: number
    mbcType: number
    ramSize: number
    gameId: string
    gameTitle: string
    gameVersion: number
    usePadding: boolean
    padding: number
}
