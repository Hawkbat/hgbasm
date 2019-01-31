
export default interface ILinkerOptions {
    padding: number
    disableWramBanks: boolean
    disableRomBanks: boolean
    disableVramBanks: boolean
    generateSymbolFile: boolean
    generateMapFile: boolean
    linkerScript: string
    overlay: Uint8Array | null
}
