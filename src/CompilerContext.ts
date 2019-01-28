import AsmFile from './AsmFile'
import DeepPartial from './DeepPartial'
import Diagnostic from './Diagnostic'
import FileContext from './FileContext'
import FixerContext from './FixerContext'
import ICompilerOptions from './ICompilerOptions'
import ILinkHole from './ILinkHole'
import LinkerContext from './LinkerContext'

export default class CompilerContext {
    public files: FileContext[]
    public includeFiles: AsmFile[]
    public options: ICompilerOptions
    public holes: ILinkHole[] = []
    public diagnostics: Diagnostic[] = []
    public link?: LinkerContext
    public fix?: FixerContext
    public romData?: Uint8Array
    public symbolData?: string

    constructor(files: AsmFile[], includeFiles: AsmFile[], options?: DeepPartial<ICompilerOptions>) {
        this.files = files.map((file) => new FileContext(this, null, file))
        this.includeFiles = includeFiles
        this.options = {
            lexer: {
                ...(options ? options.lexer : {})
            },
            parser: {
                ...(options ? options.parser : {})
            },
            evaluator: {
                padding: 0x00,
                exportAllLabels: false,
                nopAfterHalt: true,
                debugDefineName: '',
                debugDefineValue: '1',
                ...(options ? options.evaluator : {})
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
                applyHeaderFixes: true,
                cgbCompatibility: 'dmg',
                sgbCompatible: false,
                fixNintendoLogo: true,
                fixHeaderChecksum: true,
                fixGlobalChecksum: true,
                japanese: false,
                licensee: '  ',
                licenseeCode: 0x33,
                mbcType: 0x00,
                ramSize: 0x00,
                usePadding: true,
                padding: 0x00,
                gameId: '',
                gameTitle: '                ',
                gameVersion: 0,
                ...(options ? options.fixer : {})
            }
        }
    }
}
