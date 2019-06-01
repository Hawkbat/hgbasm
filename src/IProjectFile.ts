import MBCType from './Fixer/MBCType'
import RAMSize from './Fixer/RAMSize'
import ROMSize from './Fixer/ROMSize'
import CasingStyle from './Formatter/CasingStyle'
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
        settings?: {
            padding?: number
            exportAllLabels?: boolean
            nopAfterHalt?: boolean
            optimizeLd?: boolean
            debugDefineName?: string
            debugDefineValue?: string
        }
    }
    linker?: {
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
        settings?: {
            padding?: number
            disableWramBanks?: boolean
            disableRomBanks?: boolean
            disableVramBanks?: boolean
        }
    }
    fixer?: {
        outputRomFile?: boolean
        romPath?: string
        outputPath?: string
        logLevel?: LogLevel
        settings?: {
            padding?: number
            cgbCompatibility?: 'cgb' | 'dmg' | 'both'
            sgbCompatible?: boolean
            nintendoLogo?: 'fix' | 'trash'
            headerChecksum?: 'fix' | 'trash'
            globalChecksum?: 'fix' | 'trash'
            japanese?: boolean
            licensee?: string
            licenseeCode?: number | 'use-licensee' | 'none'
            mbcType?: number | MBCType
            romSize?: number | ROMSize
            ramSize?: number | RAMSize
            gameId?: string
            gameTitle?: string
            gameVersion?: number
        }
    }
    formatter?: {
        settings?: {
            useSpaces?: boolean
            tabSize?: number
            keywordCase?: CasingStyle
            opcodeCase?: CasingStyle
            psuedoOpCase?: CasingStyle
            conditionCodeCase?: CasingStyle
            registerCase?: CasingStyle
            functionCase?: CasingStyle
            regionCase?: CasingStyle
            hexLetterCase?: CasingStyle
        }
    }
    emulator?: {
        path?: string
    }
}
