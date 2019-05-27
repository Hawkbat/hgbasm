import Diagnostic from '../Diagnostic'
import IFileProvider from '../IFileProvider'
import IObjectFile from '../Linker/IObjectFile'
import RandGen from '../RandGen'
import Assembler from './Assembler'
import AssemblerMode from './AssemblerMode'
import FileContext from './FileContext'
import IAssemblerOptions from './IAssemblerOptions'
import IPatch from '../IPatch'

export default class AssemblerContext {
    public assembler: Assembler
    public options: IAssemblerOptions
    public file: FileContext
    public fileProvider: IFileProvider
    public objectFile: IObjectFile
    public startDateTime: Date
    public mode: AssemblerMode = AssemblerMode.rgbds_compatible
    public dependencies: string[] = []
    public patches: IPatch[] = []
    public diagnostics: Diagnostic[] = []
    public rng: RandGen

    constructor(assembler: Assembler, options: IAssemblerOptions, file: FileContext, fileProvider: IFileProvider) {
        this.assembler = assembler
        this.options = options
        this.file = file
        this.fileProvider = fileProvider
        this.objectFile = { path: file.source.path, symbols: [], sections: [] }
        this.startDateTime = new Date()
        this.rng = new RandGen(Date.now())
    }
}
