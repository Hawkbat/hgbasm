import AsmFile from '../AsmFile'
import AssemblerContext from '../Assembler/AssemblerContext'
import DeepPartial from '../DeepPartial'
import FixerContext from '../Fixer/FixerContext'
import IFileProvider from '../IFileProvider'
import LinkerContext from '../Linker/LinkerContext'
import ICompilerOptions from './ICompilerOptions'

export default class CompilerContext {
    public files: AsmFile[]
    public fileProvider: IFileProvider
    public options: ICompilerOptions
    public assembles?: AssemblerContext[]
    public link?: LinkerContext
    public fix?: FixerContext
    public romFile?: Uint8Array
    public symbolFile?: string

    constructor(files: AsmFile[], fileProvider: IFileProvider, options?: DeepPartial<ICompilerOptions>) {
        this.files = files
        this.fileProvider = fileProvider
        this.options = {
            maxErrors: 15,
            maxWarnings: 15,
            assembler: {
                padding: 0x00,
                exportAllLabels: false,
                nopAfterHalt: true,
                debugDefineName: '',
                debugDefineValue: '1',
                ...(options ? options.assembler : {})
            },
            linker: {
                padding: 0x00,
                disableRomBanks: false,
                disableVramBanks: false,
                disableWramBanks: false,
                generateSymbolFile: false,
                linkerScript: '',
                ...(options ? options.linker : {})
            },
            fixer: {
                cgbCompatibility: 'dmg',
                sgbCompatible: false,
                nintendoLogo: 'fix',
                headerChecksum: 'fix',
                globalChecksum: 'fix',
                japanese: false,
                licensee: '  ',
                licenseeCode: 0x33,
                mbcType: 0x00,
                ramSize: 0x00,
                padding: 0x00,
                gameId: '',
                gameTitle: '                ',
                gameVersion: 0,
                ...(options ? options.fixer : {})
            }
        }
    }
}
