import AsmFile from './AsmFile'

export default class AsmLine {
    public readonly file: AsmFile
    public readonly text: string

    constructor(file: AsmFile, text: string) {
        this.file = file
        this.text = text
    }
}
