import AsmFile from './AsmFile'

export default interface IFileProvider {
    retrieve(path: string, sender: AsmFile, binary: boolean): AsmFile | null | Promise<AsmFile | null>
}
