import * as fs from 'fs'
import * as glob from 'glob'
import * as pathUtil from 'path'
import 'source-map-support/register'
import AsmFile from './AsmFile'
import Compiler from './Compiler'
import DeepPartial from './DeepPartial'
import ICompilerOptions from './ICompilerOptions'

// const srcFolder = '../pokered/'
// const srcPaths = [
//     '../pokered/audio.asm',
//     '../pokered/main.asm',
//     '../pokered/text.asm',
//     '../pokered/wram.asm'
// ]
// const incFolder = '../pokered/'
// const incPaths = glob.sync('../pokered/**/*.*')
// const options: Partial<ICompilerOptions> = {
//     disableRomBanks: false,
//     disableVramBanks: true,
//     disableWramBanks: true
// }

// const srcFolder = '../GenericRPG-GBC/src/'
// const srcPaths = [...glob.sync('../GenericRPG-GBC/src/*.asm'), ...glob.sync('../GenericRPG-GBC/src/states/*.asm')]
// const incFolder = '../GenericRPG-GBC/inc/'
// const incPaths = glob.sync('../GenericRPG-GBC/inc/*.*')
// const options: DeepPartial<ICompilerOptions> = {
//     evaluator: {
//         padding: 0xFF
//     },
//     linker: {
//         padding: 0xFF,
//         generateSymbolFile: true
//     },
//     fixer: {
//         cgbCompatibility: 'cgb',
//         mbcType: 0x1B,
//         ramSize: 0x02,
//         licensee: '00',
//         gameId: '    ',
//         gameTitle: 'GENERICRPG2',
//         padding: 0xFF
//     }
// }

// TODO: continue refactoring options to pass relevant options sub-object to each Context

const srcFolder = '../Aevilia-GB/'
const srcPaths = [
    '../Aevilia-GB/main.asm',
    '../Aevilia-GB/battle.asm',
    '../Aevilia-GB/engine.asm',
    '../Aevilia-GB/home.asm',
    '../Aevilia-GB/gfx.asm',
    '../Aevilia-GB/maps.asm',
    '../Aevilia-GB/save.asm',
    '../Aevilia-GB/sound.asm',
    '../Aevilia-GB/text.asm',
    '../Aevilia-GB/tileset.asm'
]
const incFolder = '../Aevilia-GB/'
const incPaths = glob.sync('../Aevilia-GB/**/*.*')
const options: DeepPartial<ICompilerOptions> = {
    evaluator: {
        padding: 0xFF,
        exportAllLabels: true,
    },
    linker: {
        padding: 0xFF,
        disableRomBanks: false,
        disableVramBanks: false,
        disableWramBanks: false
    }
}

const srcFiles = srcPaths.map((path) => new AsmFile(pathUtil.relative(srcFolder, path).replace(/\\/g, '/'), fs.readFileSync(path, 'utf8')))
const incFiles = incPaths.map((path) => new AsmFile(pathUtil.relative(incFolder, path).replace(/\\/g, '/'), fs.readFileSync(path)))

const compiler = new Compiler('info')
const ctx = compiler.compile(srcFiles, incFiles, options)

if (ctx.romData) {
    fs.writeFileSync('out/rom.gbc', ctx.romData)
}
if (ctx.symbolData) {
    fs.writeFileSync('out/rom.sym', ctx.symbolData)
}