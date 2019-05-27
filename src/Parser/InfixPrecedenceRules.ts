
const InfixPrecedenceRules
    : { [key: string]: number } = {
    '&&': 2,
    '||': 2,
    '==': 3,
    '>=': 3,
    '<=': 3,
    '!=': 3,
    '<': 3,
    '>': 3,
    '+': 4,
    '-': 4,
    '&': 5,
    '|': 5,
    '^': 5,
    '<<': 6,
    '>>': 6,
    '*': 7,
    '/': 7,
    '%': 7,
    '(': 9,
    '[': 9,
    ':': 100
}

export default InfixPrecedenceRules
