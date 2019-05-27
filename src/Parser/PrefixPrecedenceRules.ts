
const PrefixPrecedenceRules: { [key: string]: number } = {
    '!': 1,
    '~': 8,
    '+': 8,
    '-': 8
}

export default PrefixPrecedenceRules
