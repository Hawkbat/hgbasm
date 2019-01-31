
export default interface IOpVariant {
    args: (
        'a' | 'b' | 'c' | 'd' | 'e' | 'h' | 'l' |
        'af' | 'bc' | 'de' | 'hl' | 'sp' |
        'C' | 'NC' | 'Z' | 'NZ' |
        '[c]' |
        '[bc]' | '[de]' | '[hl]' | '[hl+]' | '[hl-]' | '[hli]' | '[hld]' |
        'n8' | 'n16' | 'e8' | 'u3' | 'vec' |
        '[n8]' | '[n16]' |
        'sp+e8' | '[$FF00+c]' | '[$FF00+n8]'
    )[]
    opcode: number,
    prefix?: number
}
