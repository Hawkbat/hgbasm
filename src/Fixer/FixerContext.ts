import IFixerOptions from './IFixerOptions'

export default class FixerContext {
    public options: IFixerOptions
    public romFile: Uint8Array | undefined

    constructor(options: IFixerOptions, romFile: Uint8Array | undefined) {
        this.options = options
        this.romFile = romFile
    }
}
