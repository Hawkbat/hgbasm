import Diagnostic from '../Diagnostic'
import IFileProvider from '../IFileProvider'
import IPatch from '../IPatch'
import ILineState from '../LineState/ILineState'
import IObjectFile from '../Linker/IObjectFile'
import RandGen from '../RandGen'
import Assembler from './Assembler'
import AssemblerMode from './AssemblerMode'
import FileContext from './FileContext'
import IAssemblerOptions from './IAssemblerOptions'
import IDependency from './IDependency'

export default class AssemblerContext {
    public assembler: Assembler
    public options: IAssemblerOptions
    public rootFile: FileContext
    public fileProvider: IFileProvider
    public state: ILineState
    public files: FileContext[]
    public objectFile: IObjectFile
    public startDateTime: Date
    public rng: RandGen
    public mode: AssemblerMode = AssemblerMode.rgbds_compatible
    public dependencies: IDependency[] = []
    public patches: IPatch[] = []
    public diagnostics: Diagnostic[] = []

    constructor(assembler: Assembler, options: IAssemblerOptions, rootFile: FileContext, fileProvider: IFileProvider, state?: ILineState) {
        this.assembler = assembler
        this.options = options
        this.rootFile = rootFile
        this.fileProvider = fileProvider
        if (state) {
            this.state = state
        } else {
            this.state = {
                file: rootFile.source.path,
                line: rootFile.startLine
            }
        }
        this.files = [rootFile]
        this.objectFile = { path: rootFile.source.path, symbols: [], sections: [] }
        this.startDateTime = new Date()
        this.rng = new RandGen(Date.now())

        if (options.debugDefineName) {
            this.state.stringEquates = this.state.stringEquates ? this.state.stringEquates : {}
            this.state.stringEquates[options.debugDefineName] = {
                id: options.debugDefineName,
                startLine: 0,
                endLine: 0,
                file: rootFile.source.path,
                value: options.debugDefineValue
            }
        }
    }
}
