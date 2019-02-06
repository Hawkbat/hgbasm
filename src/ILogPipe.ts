
export default interface ILogPipe {
    allowAnsi: boolean
    log: (msg: string, type: string) => void
}
