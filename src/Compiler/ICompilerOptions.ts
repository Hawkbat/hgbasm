import IAssemblerOptions from '../Assembler/IAssemblerOptions'
import IFixerOptions from '../Fixer/IFixerOptions'
import ILinkerOptions from '../Linker/ILinkerOptions'

export default interface ICompilerOptions {
    maxErrors: number
    maxWarnings: number
    assembler: IAssemblerOptions
    linker: ILinkerOptions
    fixer: IFixerOptions
}
