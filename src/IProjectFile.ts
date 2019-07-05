import IAnalyzerOptions from './Analyzer/IAnalyzerOptions'
import IAssemblerOptions from './Assembler/IAssemblerOptions'
import IAutoCompleterOptions from './AutoCompleter/IAutoCompleterOptions'
import IFixerOptions from './Fixer/IFixerOptions'
import IFormatterOptions from './Formatter/IFormatterOptions'
import ILinkerOptions from './Linker/ILinkerOptions'
import { LogLevel } from './Logger'

export default interface IProjectFile {
    assembler?: {
        sourcePaths?: string[]
        includePaths?: string[]
        outputDependFiles?: boolean
        dependPath?: string
        outputObjectFiles?: boolean
        objectPath?: string
        logLevel?: LogLevel
        settings?: Partial<IAssemblerOptions>
    }
    linker?: {
        objectPaths?: string[]
        outputRomFile?: boolean
        romPath?: string
        outputMapFile?: boolean
        mapPath?: string
        outputSymFile?: boolean
        symPath?: string
        useOverlay?: boolean
        overlayPath?: string
        useLinkerScript?: boolean
        linkerScriptPath?: string
        logLevel?: LogLevel
        settings?: Partial<ILinkerOptions>
    }
    fixer?: {
        outputRomFile?: boolean
        romPath?: string
        outputPath?: string
        logLevel?: LogLevel
        settings?: Partial<IFixerOptions>
    }
    formatter?: {
        settings?: Partial<IFormatterOptions>
    }
    analyzer?: {
        settings?: Partial<IAnalyzerOptions>
    }
    autoCompleter?: {
        settings?: Partial<IAutoCompleterOptions>
    }
    emulator?: {
        path?: string
    }
}
