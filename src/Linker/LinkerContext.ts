import Diagnostic from '../Diagnostic'
import ILinkerOptions from './ILinkerOptions'
import ILinkSection from './ILinkSection'
import IObjectFile from './IObjectFile'
import IRegionTypeMap from './IRegionTypeMap'
import ISectionFileMap from './ISectionFileMap'

export default class LinkerContext {
    public options: ILinkerOptions
    public objectFiles: IObjectFile[]
    public regionTypeMap: IRegionTypeMap = {}
    public sectionFileMap: ISectionFileMap = {}
    public linkSections: ILinkSection[] = []
    public diagnostics: Diagnostic[] = []
    public romFile?: Uint8Array
    public symbolFile?: string

    constructor(options: ILinkerOptions, objectFiles: IObjectFile[]) {
        this.options = options
        this.objectFiles = objectFiles
    }
}
