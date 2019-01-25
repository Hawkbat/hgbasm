
enum Ansi {
    Black = '\u001b[30m',
    Red = '\u001b[31m',
    Green = '\u001b[32m',
    Yellow = '\u001b[33m',
    Blue = '\u001b[34m',
    Magenta = '\u001b[35m',
    Cyan = '\u001b[36m',
    White = '\u001b[37m',
    BrightBlack = '\u001b[30;1m',
    BrightRed = '\u001b[31;1m',
    BrightGreen = '\u001b[32;1m',
    BrightYellow = '\u001b[33;1m',
    BrightBlue = '\u001b[34;1m',
    BrightMagenta = '\u001b[35;1m',
    BrightCyan = '\u001b[36;1m',
    BrightWhite = '\u001b[37;1m',
    BGBlack = '\u001b[40m',
    BGRed = '\u001b[41m',
    BGGreen = '\u001b[42m',
    BGYellow = '\u001b[43m',
    BGBlue = '\u001b[44m',
    BGMagenta = '\u001b[45m',
    BGCyan = '\u001b[46m',
    BGWhite = '\u001b[47m',
    BGBrightBlack = '\u001b[40;1m',
    BGBrightRed = '\u001b[41;1m',
    BGBrightGreen = '\u001b[42;1m',
    BGBrightYellow = '\u001b[43;1m',
    BGBrightBlue = '\u001b[44;1m',
    BGBrightMagenta = '\u001b[45;1m',
    BGBrightCyan = '\u001b[46;1m',
    BGBrightWhite = '\u001b[47;1m',
    Bold = '\u001b[1m',
    Underline = '\u001b[4m',
    Reverse = '\u001b[7m',
    Reset = '\u001b[0m'
}

export type LogLevel = 'off' | 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'all'
export type LogType = 'lineSource' | 'defineSymbol' | 'purgeSymbol' | 'stringExpansion' | 'linkHole' | 'linkSection' | 'tokenStream' | 'lineNode' | 'lineState' | 'diagnosticError' | 'diagnosticWarn' | 'diagnosticInfo' | 'compileInfo' | 'compileCrash'

const levelArr: LogLevel[] = [
    'off',
    'fatal',
    'error',
    'warn',
    'info',
    'debug',
    'trace',
    'all'
]

const colorMap: { [key in LogType]: Ansi } = {
    lineSource: Ansi.White,
    defineSymbol: Ansi.Yellow,
    purgeSymbol: Ansi.Magenta,
    stringExpansion: Ansi.BrightBlack,
    linkHole: Ansi.BrightBlack,
    linkSection: Ansi.White,
    tokenStream: Ansi.BrightBlack,
    lineNode: Ansi.BrightBlack,
    lineState: Ansi.BrightBlack,
    diagnosticError: Ansi.Red,
    diagnosticWarn: Ansi.Yellow,
    diagnosticInfo: Ansi.White,
    compileInfo: Ansi.White,
    compileCrash: Ansi.BrightRed
}

const levelMap: { [key in LogType]: LogLevel } = {
    lineSource: 'trace',
    defineSymbol: 'trace',
    purgeSymbol: 'trace',
    stringExpansion: 'trace',
    linkHole: 'trace',
    linkSection: 'debug',
    tokenStream: 'debug',
    lineNode: 'debug',
    lineState: 'debug',
    diagnosticError: 'error',
    diagnosticWarn: 'warn',
    diagnosticInfo: 'info',
    compileInfo: 'info',
    compileCrash: 'fatal'
}

interface ILogMsg {
    type: LogType
    msg: string
}

export default class Logger {
    constructor(
        public level: LogLevel,
        public logs: ILogMsg[] = []
    ) {

    }

    public log(type: LogType, ...msg: string[]): void {
        if (levelArr.indexOf(levelMap[type]) <= levelArr.indexOf(this.level)) {
            // tslint:disable-next-line: no-console
            console.log(`${colorMap[type]}${msg.join(' ').replace(/\t/g, '    ').trimRight()}${Ansi.Reset}`)
        }
        this.logs.push({ type, msg: msg.join(' ') })
    }
}
