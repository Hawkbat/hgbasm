import AsmFile from './AsmFile'

export default interface IFileProvider {
    retrieve(path: string, binary: boolean): AsmFile | null | Promise<AsmFile | null>
}
