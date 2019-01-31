import * as fs from 'fs-extra'
import * as glob from 'glob'
import * as pathUtil from 'path'
import AsmFile from './AsmFile'
import Compiler from './Compiler/Compiler'
import ICompilerOptions from './Compiler/ICompilerOptions'
import DeepPartial from './DeepPartial'
import IFileProvider from './IFileProvider'

// const srcFolder = '../pokered/'
// const srcPaths = [
//     '../pokered/audio.asm',
//     '../pokered/main.asm',
//     '../pokered/text.asm',
//     '../pokered/wram.asm'
// ]
// const incPaths = glob.sync('../pokered/**/')
// const options: DeepPartial<ICompilerOptions> = {
//     assembler: {
//         debugDefineName: '_RED',
//         nopAfterHalt: false
//     },
//     linker: {
//         disableRomBanks: false,
//         disableVramBanks: true,
//         disableWramBanks: true,
//         generateSymbolFile: true,
//         linkerScript: fs.readFileSync('../pokered/pokered.link', 'utf8')
//     },
//     fixer: {
//         sgbCompatible: true,
//         licensee: '01',
//         mbcType: 0x13,
//         ramSize: 0x03,
//         gameTitle: 'POKEMON RED'
//     }
// }

const srcFolder = '../GenericRPG-GBC/src/'
const srcPaths = [...glob.sync('../GenericRPG-GBC/src/*.asm'), ...glob.sync('../GenericRPG-GBC/src/states/*.asm')]
const incPaths = ['../GenericRPG-GBC/inc/']
const options: DeepPartial<ICompilerOptions> = {
    assembler: {
        padding: 0xFF
    },
    linker: {
        padding: 0xFF,
        generateSymbolFile: true
    },
    fixer: {
        cgbCompatibility: 'cgb',
        mbcType: 0x1B,
        ramSize: 0x02,
        licensee: '00',
        gameId: '    ',
        gameTitle: 'GENERICRPG2',
        padding: 0xFF
    }
}

// const srcFolder = '../Aevilia-GB/'
// const srcPaths = [
//     '../Aevilia-GB/main.asm',
//     '../Aevilia-GB/battle.asm',
//     '../Aevilia-GB/engine.asm',
//     '../Aevilia-GB/home.asm',
//     '../Aevilia-GB/gfx.asm',
//     '../Aevilia-GB/maps.asm',
//     '../Aevilia-GB/save.asm',
//     '../Aevilia-GB/sound.asm',
//     '../Aevilia-GB/text.asm',
//     '../Aevilia-GB/tileset.asm'
// ]
// const incPaths = glob.sync('../Aevilia-GB/**/')
// const options: DeepPartial<ICompilerOptions> = {
//     assembler: {
//         padding: 0xFF,
//         exportAllLabels: true
//     },
//     linker: {
//         padding: 0xFF,
//         disableRomBanks: false,
//         disableVramBanks: false,
//         disableWramBanks: false
//     }
// }

const srcFiles = srcPaths.map((path) => new AsmFile(pathUtil.relative(srcFolder, path).replace(/\\/g, '/'), fs.readFileSync(path, 'utf8')))

const provider: IFileProvider = {
    retrieve: async (path, binary) => {
        for (const incPath of incPaths) {
            try {
                const filePath = pathUtil.resolve(incPath, path)
                const file = await fs.readFile(filePath, binary ? 'binary' : 'utf8')
                return new AsmFile(pathUtil.relative(srcFolder, filePath), file)
            } catch (_) {
                // file does not exist; do nothing
            }
        }
        return null
    }
}

async function compile(): Promise<void> {
    const compiler = new Compiler('info')
    const ctx = await compiler.compile(srcFiles, provider, options)

    if (ctx.romFile) {
        fs.writeFileSync('out/rom.gb', ctx.romFile)
    }
    if (ctx.symbolFile) {
        fs.writeFileSync('out/rom.sym', ctx.symbolFile)
    }
}

compile()
