import Compiler from './Compiler'
import Diagnostic from './Diagnostic'
import EvaluatorContext from './EvaluatorContext'
import FileContext from './FileContext'
import IEvaluatorOptions from './IEvaluatorOptions'
import ILineState from './ILineState'
import ILinkHole from './ILinkHole'
import LineContext from './LineContext'
import Node from './Node'
import NodeType from './NodeType'
import Token from './Token'
import TokenType from './TokenType'

interface IOpVariant {
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

type OpRule = IOpVariant[]

type EvaluatorRule = (state: ILineState, op: Node, label: Node | null, ctx: EvaluatorContext) => ILineState
type ConstExprRule = (op: Node, ctx: EvaluatorContext) => number | string

export default class Evaluator {

    public opRules: { [key: string]: OpRule } = {
        adc: [
            {
                args: ['a'],
                opcode: 0x8F
            },
            {
                args: ['b'],
                opcode: 0x88
            },
            {
                args: ['c'],
                opcode: 0x89
            },
            {
                args: ['d'],
                opcode: 0x8A
            },
            {
                args: ['e'],
                opcode: 0x8B
            },
            {
                args: ['h'],
                opcode: 0x8C
            },
            {
                args: ['l'],
                opcode: 0x8D
            },
            {
                args: ['[hl]'],
                opcode: 0x8E
            },
            {
                args: ['n8'],
                opcode: 0xCE
            },
            {
                args: ['a', 'a'],
                opcode: 0x8F
            },
            {
                args: ['a', 'b'],
                opcode: 0x88
            },
            {
                args: ['a', 'c'],
                opcode: 0x89
            },
            {
                args: ['a', 'd'],
                opcode: 0x8A
            },
            {
                args: ['a', 'e'],
                opcode: 0x8B
            },
            {
                args: ['a', 'h'],
                opcode: 0x8C
            },
            {
                args: ['a', 'l'],
                opcode: 0x8D
            },
            {
                args: ['a', '[hl]'],
                opcode: 0x8E
            },
            {
                args: ['a', 'n8'],
                opcode: 0xCE
            }
        ],
        add: [
            {
                args: ['a'],
                opcode: 0x87
            },
            {
                args: ['b'],
                opcode: 0x80
            },
            {
                args: ['c'],
                opcode: 0x81
            },
            {
                args: ['d'],
                opcode: 0x82
            },
            {
                args: ['e'],
                opcode: 0x83
            },
            {
                args: ['h'],
                opcode: 0x84
            },
            {
                args: ['l'],
                opcode: 0x85
            },
            {
                args: ['[hl]'],
                opcode: 0x86
            },
            {
                args: ['n8'],
                opcode: 0xC6
            },
            {
                args: ['a', 'a'],
                opcode: 0x87
            },
            {
                args: ['a', 'b'],
                opcode: 0x80
            },
            {
                args: ['a', 'c'],
                opcode: 0x81
            },
            {
                args: ['a', 'd'],
                opcode: 0x82
            },
            {
                args: ['a', 'e'],
                opcode: 0x83
            },
            {
                args: ['a', 'h'],
                opcode: 0x84
            },
            {
                args: ['a', 'l'],
                opcode: 0x85
            },
            {
                args: ['a', '[hl]'],
                opcode: 0x86
            },
            {
                args: ['a', 'n8'],
                opcode: 0xC6
            },
            {
                args: ['hl', 'bc'],
                opcode: 0x09
            },
            {
                args: ['hl', 'de'],
                opcode: 0x19
            },
            {
                args: ['hl', 'hl'],
                opcode: 0x29
            },
            {
                args: ['hl', 'sp'],
                opcode: 0x39
            },
            {
                args: ['sp', 'e8'],
                opcode: 0xE8
            }
        ],
        and: [
            {
                args: ['a'],
                opcode: 0xA7
            },
            {
                args: ['b'],
                opcode: 0xA0
            },
            {
                args: ['c'],
                opcode: 0xA1
            },
            {
                args: ['d'],
                opcode: 0xA2
            },
            {
                args: ['e'],
                opcode: 0xA3
            },
            {
                args: ['h'],
                opcode: 0xA4
            },
            {
                args: ['l'],
                opcode: 0xA5
            },
            {
                args: ['[hl]'],
                opcode: 0xA6
            },
            {
                args: ['n8'],
                opcode: 0xE6
            },
            {
                args: ['a', 'a'],
                opcode: 0xA7
            },
            {
                args: ['a', 'b'],
                opcode: 0xA0
            },
            {
                args: ['a', 'c'],
                opcode: 0xA1
            },
            {
                args: ['a', 'd'],
                opcode: 0xA2
            },
            {
                args: ['a', 'e'],
                opcode: 0xA3
            },
            {
                args: ['a', 'h'],
                opcode: 0xA4
            },
            {
                args: ['a', 'l'],
                opcode: 0xA5
            },
            {
                args: ['a', '[hl]'],
                opcode: 0xA6
            },
            {
                args: ['a', 'n8'],
                opcode: 0xE6
            }
        ],
        cp: [
            {
                args: ['a'],
                opcode: 0xBF
            },
            {
                args: ['b'],
                opcode: 0xB8
            },
            {
                args: ['c'],
                opcode: 0xB9
            },
            {
                args: ['d'],
                opcode: 0xBA
            },
            {
                args: ['e'],
                opcode: 0xBB
            },
            {
                args: ['h'],
                opcode: 0xBC
            },
            {
                args: ['l'],
                opcode: 0xBD
            },
            {
                args: ['[hl]'],
                opcode: 0xBE
            },
            {
                args: ['n8'],
                opcode: 0xFE
            },
            {
                args: ['a', 'a'],
                opcode: 0xBF
            },
            {
                args: ['a', 'b'],
                opcode: 0xB8
            },
            {
                args: ['a', 'c'],
                opcode: 0xB9
            },
            {
                args: ['a', 'd'],
                opcode: 0xBA
            },
            {
                args: ['a', 'e'],
                opcode: 0xBB
            },
            {
                args: ['a', 'h'],
                opcode: 0xBC
            },
            {
                args: ['a', 'l'],
                opcode: 0xBD
            },
            {
                args: ['a', '[hl]'],
                opcode: 0xBE
            },
            {
                args: ['a', 'n8'],
                opcode: 0xFE
            }
        ],
        dec: [
            {
                args: ['a'],
                opcode: 0x3D
            },
            {
                args: ['b'],
                opcode: 0x05
            },
            {
                args: ['c'],
                opcode: 0x0D
            },
            {
                args: ['d'],
                opcode: 0x15
            },
            {
                args: ['e'],
                opcode: 0x1D
            },
            {
                args: ['h'],
                opcode: 0x25
            },
            {
                args: ['l'],
                opcode: 0x2D
            },
            {
                args: ['[hl]'],
                opcode: 0x35
            },
            {
                args: ['bc'],
                opcode: 0x0B
            },
            {
                args: ['de'],
                opcode: 0x1B
            },
            {
                args: ['hl'],
                opcode: 0x2B
            },
            {
                args: ['sp'],
                opcode: 0x3B
            }
        ],
        inc: [
            {
                args: ['a'],
                opcode: 0x3C
            },
            {
                args: ['b'],
                opcode: 0x04
            },
            {
                args: ['c'],
                opcode: 0x0C
            },
            {
                args: ['d'],
                opcode: 0x14
            },
            {
                args: ['e'],
                opcode: 0x1C
            },
            {
                args: ['h'],
                opcode: 0x24
            },
            {
                args: ['l'],
                opcode: 0x2C
            },
            {
                args: ['[hl]'],
                opcode: 0x34
            },
            {
                args: ['bc'],
                opcode: 0x03
            },
            {
                args: ['de'],
                opcode: 0x13
            },
            {
                args: ['hl'],
                opcode: 0x23
            },
            {
                args: ['sp'],
                opcode: 0x33
            }
        ],
        or: [
            {
                args: ['a'],
                opcode: 0xB7
            },
            {
                args: ['b'],
                opcode: 0xB0
            },
            {
                args: ['c'],
                opcode: 0xB1
            },
            {
                args: ['d'],
                opcode: 0xB2
            },
            {
                args: ['e'],
                opcode: 0xB3
            },
            {
                args: ['h'],
                opcode: 0xB4
            },
            {
                args: ['l'],
                opcode: 0xB5
            },
            {
                args: ['[hl]'],
                opcode: 0xB6
            },
            {
                args: ['n8'],
                opcode: 0xF6
            },
            {
                args: ['a', 'a'],
                opcode: 0xB7
            },
            {
                args: ['a', 'b'],
                opcode: 0xB0
            },
            {
                args: ['a', 'c'],
                opcode: 0xB1
            },
            {
                args: ['a', 'd'],
                opcode: 0xB2
            },
            {
                args: ['a', 'e'],
                opcode: 0xB3
            },
            {
                args: ['a', 'h'],
                opcode: 0xB4
            },
            {
                args: ['a', 'l'],
                opcode: 0xB5
            },
            {
                args: ['a', '[hl]'],
                opcode: 0xB6
            },
            {
                args: ['a', 'n8'],
                opcode: 0xF6
            }
        ],
        sbc: [
            {
                args: ['a'],
                opcode: 0x9F
            },
            {
                args: ['b'],
                opcode: 0x98
            },
            {
                args: ['c'],
                opcode: 0x99
            },
            {
                args: ['d'],
                opcode: 0x9A
            },
            {
                args: ['e'],
                opcode: 0x9B
            },
            {
                args: ['h'],
                opcode: 0x9C
            },
            {
                args: ['l'],
                opcode: 0x9D
            },
            {
                args: ['[hl]'],
                opcode: 0x9E
            },
            {
                args: ['n8'],
                opcode: 0xDE
            },
            {
                args: ['a', 'a'],
                opcode: 0x9F
            },
            {
                args: ['a', 'b'],
                opcode: 0x98
            },
            {
                args: ['a', 'c'],
                opcode: 0x99
            },
            {
                args: ['a', 'd'],
                opcode: 0x9A
            },
            {
                args: ['a', 'e'],
                opcode: 0x9B
            },
            {
                args: ['a', 'h'],
                opcode: 0x9C
            },
            {
                args: ['a', 'l'],
                opcode: 0x9D
            },
            {
                args: ['a', '[hl]'],
                opcode: 0x9E
            },
            {
                args: ['a', 'n8'],
                opcode: 0xDE
            }
        ],
        sub: [
            {
                args: ['a'],
                opcode: 0x97
            },
            {
                args: ['b'],
                opcode: 0x90
            },
            {
                args: ['c'],
                opcode: 0x91
            },
            {
                args: ['d'],
                opcode: 0x92
            },
            {
                args: ['e'],
                opcode: 0x93
            },
            {
                args: ['h'],
                opcode: 0x94
            },
            {
                args: ['l'],
                opcode: 0x95
            },
            {
                args: ['[hl]'],
                opcode: 0x96
            },
            {
                args: ['n8'],
                opcode: 0xD6
            },
            {
                args: ['a', 'a'],
                opcode: 0x97
            },
            {
                args: ['a', 'b'],
                opcode: 0x90
            },
            {
                args: ['a', 'c'],
                opcode: 0x91
            },
            {
                args: ['a', 'd'],
                opcode: 0x92
            },
            {
                args: ['a', 'e'],
                opcode: 0x93
            },
            {
                args: ['a', 'h'],
                opcode: 0x94
            },
            {
                args: ['a', 'l'],
                opcode: 0x95
            },
            {
                args: ['a', '[hl]'],
                opcode: 0x96
            },
            {
                args: ['a', 'n8'],
                opcode: 0xD6
            }
        ],
        xor: [
            {
                args: ['a'],
                opcode: 0xAF
            },
            {
                args: ['b'],
                opcode: 0xA8
            },
            {
                args: ['c'],
                opcode: 0xA9
            },
            {
                args: ['d'],
                opcode: 0xAA
            },
            {
                args: ['e'],
                opcode: 0xAB
            },
            {
                args: ['h'],
                opcode: 0xAC
            },
            {
                args: ['l'],
                opcode: 0xAD
            },
            {
                args: ['[hl]'],
                opcode: 0xAE
            },
            {
                args: ['n8'],
                opcode: 0xEE
            },
            {
                args: ['a', 'a'],
                opcode: 0xAF
            },
            {
                args: ['a', 'b'],
                opcode: 0xA8
            },
            {
                args: ['a', 'c'],
                opcode: 0xA9
            },
            {
                args: ['a', 'd'],
                opcode: 0xAA
            },
            {
                args: ['a', 'e'],
                opcode: 0xAB
            },
            {
                args: ['a', 'h'],
                opcode: 0xAC
            },
            {
                args: ['a', 'l'],
                opcode: 0xAD
            },
            {
                args: ['a', '[hl]'],
                opcode: 0xAE
            },
            {
                args: ['a', 'n8'],
                opcode: 0xEE
            }
        ],
        bit: [
            {
                args: ['u3', 'a'],
                opcode: 0x47,
                prefix: 0xCB
            },
            {
                args: ['u3', 'b'],
                opcode: 0x40,
                prefix: 0xCB
            },
            {
                args: ['u3', 'c'],
                opcode: 0x41,
                prefix: 0xCB
            },
            {
                args: ['u3', 'd'],
                opcode: 0x42,
                prefix: 0xCB
            },
            {
                args: ['u3', 'e'],
                opcode: 0x43,
                prefix: 0xCB
            },
            {
                args: ['u3', 'h'],
                opcode: 0x44,
                prefix: 0xCB
            },
            {
                args: ['u3', 'l'],
                opcode: 0x45,
                prefix: 0xCB
            },
            {
                args: ['u3', '[hl]'],
                opcode: 0x46,
                prefix: 0xCB
            }
        ],
        res: [
            {
                args: ['u3', 'a'],
                opcode: 0x87,
                prefix: 0xCB
            },
            {
                args: ['u3', 'b'],
                opcode: 0x80,
                prefix: 0xCB
            },
            {
                args: ['u3', 'c'],
                opcode: 0x81,
                prefix: 0xCB
            },
            {
                args: ['u3', 'd'],
                opcode: 0x82,
                prefix: 0xCB
            },
            {
                args: ['u3', 'e'],
                opcode: 0x83,
                prefix: 0xCB
            },
            {
                args: ['u3', 'h'],
                opcode: 0x84,
                prefix: 0xCB
            },
            {
                args: ['u3', 'l'],
                opcode: 0x85,
                prefix: 0xCB
            },
            {
                args: ['u3', '[hl]'],
                opcode: 0x86,
                prefix: 0xCB
            }
        ],
        set: [
            {
                args: ['u3', 'a'],
                opcode: 0xC7,
                prefix: 0xCB
            },
            {
                args: ['u3', 'b'],
                opcode: 0xC0,
                prefix: 0xCB
            },
            {
                args: ['u3', 'c'],
                opcode: 0xC1,
                prefix: 0xCB
            },
            {
                args: ['u3', 'd'],
                opcode: 0xC2,
                prefix: 0xCB
            },
            {
                args: ['u3', 'e'],
                opcode: 0xC3,
                prefix: 0xCB
            },
            {
                args: ['u3', 'h'],
                opcode: 0xC4,
                prefix: 0xCB
            },
            {
                args: ['u3', 'l'],
                opcode: 0xC5,
                prefix: 0xCB
            },
            {
                args: ['u3', '[hl]'],
                opcode: 0xC6,
                prefix: 0xCB
            }
        ],
        swap: [
            {
                args: ['a'],
                opcode: 0x37,
                prefix: 0xCB
            },
            {
                args: ['b'],
                opcode: 0x30,
                prefix: 0xCB
            },
            {
                args: ['c'],
                opcode: 0x31,
                prefix: 0xCB
            },
            {
                args: ['d'],
                opcode: 0x32,
                prefix: 0xCB
            },
            {
                args: ['e'],
                opcode: 0x33,
                prefix: 0xCB
            },
            {
                args: ['h'],
                opcode: 0x34,
                prefix: 0xCB
            },
            {
                args: ['l'],
                opcode: 0x35,
                prefix: 0xCB
            },
            {
                args: ['[hl]'],
                opcode: 0x36,
                prefix: 0xCB
            }
        ],
        rl: [
            {
                args: ['a'],
                opcode: 0x17,
                prefix: 0xCB
            },
            {
                args: ['b'],
                opcode: 0x10,
                prefix: 0xCB
            },
            {
                args: ['c'],
                opcode: 0x11,
                prefix: 0xCB
            },
            {
                args: ['d'],
                opcode: 0x12,
                prefix: 0xCB
            },
            {
                args: ['e'],
                opcode: 0x13,
                prefix: 0xCB
            },
            {
                args: ['h'],
                opcode: 0x14,
                prefix: 0xCB
            },
            {
                args: ['l'],
                opcode: 0x15,
                prefix: 0xCB
            },
            {
                args: ['[hl]'],
                opcode: 0x16,
                prefix: 0xCB
            }
        ],
        rla: [
            {
                args: [],
                opcode: 0x17
            }
        ],
        rlc: [
            {
                args: ['a'],
                opcode: 0x07,
                prefix: 0xCB
            },
            {
                args: ['b'],
                opcode: 0x00,
                prefix: 0xCB
            },
            {
                args: ['c'],
                opcode: 0x01,
                prefix: 0xCB
            },
            {
                args: ['d'],
                opcode: 0x02,
                prefix: 0xCB
            },
            {
                args: ['e'],
                opcode: 0x03,
                prefix: 0xCB
            },
            {
                args: ['h'],
                opcode: 0x04,
                prefix: 0xCB
            },
            {
                args: ['l'],
                opcode: 0x05,
                prefix: 0xCB
            },
            {
                args: ['[hl]'],
                opcode: 0x06,
                prefix: 0xCB
            }
        ],
        rlca: [
            {
                args: [],
                opcode: 0x07
            }
        ],
        rr: [
            {
                args: ['a'],
                opcode: 0x1F,
                prefix: 0xCB
            },
            {
                args: ['b'],
                opcode: 0x18,
                prefix: 0xCB
            },
            {
                args: ['c'],
                opcode: 0x19,
                prefix: 0xCB
            },
            {
                args: ['d'],
                opcode: 0x1A,
                prefix: 0xCB
            },
            {
                args: ['e'],
                opcode: 0x1B,
                prefix: 0xCB
            },
            {
                args: ['h'],
                opcode: 0x1C,
                prefix: 0xCB
            },
            {
                args: ['l'],
                opcode: 0x1D,
                prefix: 0xCB
            },
            {
                args: ['[hl]'],
                opcode: 0x1E,
                prefix: 0xCB
            }
        ],
        rra: [
            {
                args: [],
                opcode: 0x1F
            }
        ],
        rrc: [
            {
                args: ['a'],
                opcode: 0x0F,
                prefix: 0xCB
            },
            {
                args: ['b'],
                opcode: 0x08,
                prefix: 0xCB
            },
            {
                args: ['c'],
                opcode: 0x09,
                prefix: 0xCB
            },
            {
                args: ['d'],
                opcode: 0x0A,
                prefix: 0xCB
            },
            {
                args: ['e'],
                opcode: 0x0B,
                prefix: 0xCB
            },
            {
                args: ['h'],
                opcode: 0x0C,
                prefix: 0xCB
            },
            {
                args: ['l'],
                opcode: 0x0D,
                prefix: 0xCB
            },
            {
                args: ['[hl]'],
                opcode: 0x0E,
                prefix: 0xCB
            }
        ],
        rrca: [
            {
                args: [],
                opcode: 0x0F
            }
        ],
        sla: [
            {
                args: ['a'],
                opcode: 0x27,
                prefix: 0xCB
            },
            {
                args: ['b'],
                opcode: 0x20,
                prefix: 0xCB
            },
            {
                args: ['c'],
                opcode: 0x21,
                prefix: 0xCB
            },
            {
                args: ['d'],
                opcode: 0x22,
                prefix: 0xCB
            },
            {
                args: ['e'],
                opcode: 0x23,
                prefix: 0xCB
            },
            {
                args: ['h'],
                opcode: 0x24,
                prefix: 0xCB
            },
            {
                args: ['l'],
                opcode: 0x25,
                prefix: 0xCB
            },
            {
                args: ['[hl]'],
                opcode: 0x26,
                prefix: 0xCB
            }
        ],
        sra: [
            {
                args: ['a'],
                opcode: 0x2F,
                prefix: 0xCB
            },
            {
                args: ['b'],
                opcode: 0x28,
                prefix: 0xCB
            },
            {
                args: ['c'],
                opcode: 0x29,
                prefix: 0xCB
            },
            {
                args: ['d'],
                opcode: 0x2A,
                prefix: 0xCB
            },
            {
                args: ['e'],
                opcode: 0x2B,
                prefix: 0xCB
            },
            {
                args: ['h'],
                opcode: 0x2C,
                prefix: 0xCB
            },
            {
                args: ['l'],
                opcode: 0x2D,
                prefix: 0xCB
            },
            {
                args: ['[hl]'],
                opcode: 0x2E,
                prefix: 0xCB
            }
        ],
        srl: [
            {
                args: ['a'],
                opcode: 0x3F,
                prefix: 0xCB
            },
            {
                args: ['b'],
                opcode: 0x38,
                prefix: 0xCB
            },
            {
                args: ['c'],
                opcode: 0x39,
                prefix: 0xCB
            },
            {
                args: ['d'],
                opcode: 0x3A,
                prefix: 0xCB
            },
            {
                args: ['e'],
                opcode: 0x3B,
                prefix: 0xCB
            },
            {
                args: ['h'],
                opcode: 0x3C,
                prefix: 0xCB
            },
            {
                args: ['l'],
                opcode: 0x3D,
                prefix: 0xCB
            },
            {
                args: ['[hl]'],
                opcode: 0x3E,
                prefix: 0xCB
            }
        ],
        ld: [
            {
                args: ['a', 'a'],
                opcode: 0x7F
            },
            {
                args: ['a', 'b'],
                opcode: 0x78
            },
            {
                args: ['a', 'c'],
                opcode: 0x79
            },
            {
                args: ['a', 'd'],
                opcode: 0x7A
            },
            {
                args: ['a', 'e'],
                opcode: 0x7B
            },
            {
                args: ['a', 'h'],
                opcode: 0x7C
            },
            {
                args: ['a', 'l'],
                opcode: 0x7D
            },
            {
                args: ['a', '[c]'],
                opcode: 0xF2
            },
            {
                args: ['a', '[bc]'],
                opcode: 0x0A
            },
            {
                args: ['a', '[de]'],
                opcode: 0x1A
            },
            {
                args: ['a', '[hl]'],
                opcode: 0x7E
            },
            {
                args: ['a', '[hl+]'],
                opcode: 0x2A
            },
            {
                args: ['a', '[hli]'],
                opcode: 0x2A
            },
            {
                args: ['a', '[hl-]'],
                opcode: 0x3A
            },
            {
                args: ['a', '[hld]'],
                opcode: 0x3A
            },
            {
                args: ['a', '[$FF00+c]'],
                opcode: 0xF2
            },
            {
                args: ['a', '[$FF00+n8]'],
                opcode: 0xF0
            },
            {
                args: ['a', '[n16]'],
                opcode: 0xFA
            },
            {
                args: ['a', 'n8'],
                opcode: 0x3E
            },
            {
                args: ['b', 'a'],
                opcode: 0x47
            },
            {
                args: ['b', 'b'],
                opcode: 0x40
            },
            {
                args: ['b', 'c'],
                opcode: 0x41
            },
            {
                args: ['b', 'd'],
                opcode: 0x42
            },
            {
                args: ['b', 'e'],
                opcode: 0x43
            },
            {
                args: ['b', 'h'],
                opcode: 0x44
            },
            {
                args: ['b', 'l'],
                opcode: 0x45
            },
            {
                args: ['b', '[hl]'],
                opcode: 0x46
            },
            {
                args: ['b', 'n8'],
                opcode: 0x06
            },
            {
                args: ['c', 'a'],
                opcode: 0x4F
            },
            {
                args: ['c', 'b'],
                opcode: 0x48
            },
            {
                args: ['c', 'c'],
                opcode: 0x49
            },
            {
                args: ['c', 'd'],
                opcode: 0x4A
            },
            {
                args: ['c', 'e'],
                opcode: 0x4B
            },
            {
                args: ['c', 'h'],
                opcode: 0x4C
            },
            {
                args: ['c', 'l'],
                opcode: 0x4D
            },
            {
                args: ['c', '[hl]'],
                opcode: 0x4E
            },
            {
                args: ['c', 'n8'],
                opcode: 0x0E
            },
            {
                args: ['d', 'a'],
                opcode: 0x57
            },
            {
                args: ['d', 'b'],
                opcode: 0x50
            },
            {
                args: ['d', 'c'],
                opcode: 0x51
            },
            {
                args: ['d', 'd'],
                opcode: 0x52
            },
            {
                args: ['d', 'e'],
                opcode: 0x53
            },
            {
                args: ['d', 'h'],
                opcode: 0x54
            },
            {
                args: ['d', 'l'],
                opcode: 0x55
            },
            {
                args: ['d', '[hl]'],
                opcode: 0x56
            },
            {
                args: ['d', 'n8'],
                opcode: 0x16
            },
            {
                args: ['e', 'a'],
                opcode: 0x5F
            },
            {
                args: ['e', 'b'],
                opcode: 0x58
            },
            {
                args: ['e', 'c'],
                opcode: 0x59
            },
            {
                args: ['e', 'd'],
                opcode: 0x5A
            },
            {
                args: ['e', 'e'],
                opcode: 0x5B
            },
            {
                args: ['e', 'h'],
                opcode: 0x5C
            },
            {
                args: ['e', 'l'],
                opcode: 0x5D
            },
            {
                args: ['e', '[hl]'],
                opcode: 0x5E
            },
            {
                args: ['e', 'n8'],
                opcode: 0x1E
            },
            {
                args: ['h', 'a'],
                opcode: 0x67
            },
            {
                args: ['h', 'b'],
                opcode: 0x60
            },
            {
                args: ['h', 'c'],
                opcode: 0x61
            },
            {
                args: ['h', 'd'],
                opcode: 0x62
            },
            {
                args: ['h', 'e'],
                opcode: 0x63
            },
            {
                args: ['h', 'h'],
                opcode: 0x64
            },
            {
                args: ['h', 'l'],
                opcode: 0x65
            },
            {
                args: ['h', '[hl]'],
                opcode: 0x66
            },
            {
                args: ['h', 'n8'],
                opcode: 0x26
            },
            {
                args: ['l', 'a'],
                opcode: 0x6F
            },
            {
                args: ['l', 'b'],
                opcode: 0x68
            },
            {
                args: ['l', 'c'],
                opcode: 0x69
            },
            {
                args: ['l', 'd'],
                opcode: 0x6A
            },
            {
                args: ['l', 'e'],
                opcode: 0x6B
            },
            {
                args: ['l', 'h'],
                opcode: 0x6C
            },
            {
                args: ['l', 'l'],
                opcode: 0x6D
            },
            {
                args: ['l', '[hl]'],
                opcode: 0x6E
            },
            {
                args: ['l', 'n8'],
                opcode: 0x2E
            },
            {
                args: ['bc', 'n16'],
                opcode: 0x01
            },
            {
                args: ['de', 'n16'],
                opcode: 0x11
            },
            {
                args: ['hl', 'sp+e8'],
                opcode: 0xF8
            },
            {
                args: ['hl', 'n16'],
                opcode: 0x21
            },
            {
                args: ['sp', 'hl'],
                opcode: 0xF9
            },
            {
                args: ['sp', 'n16'],
                opcode: 0x31
            },
            {
                args: ['[c]', 'a'],
                opcode: 0xE2
            },
            {
                args: ['[bc]', 'a'],
                opcode: 0x02
            },
            {
                args: ['[de]', 'a'],
                opcode: 0x12
            },
            {
                args: ['[hl]', 'a'],
                opcode: 0x77
            },
            {
                args: ['[hl]', 'b'],
                opcode: 0x70
            },
            {
                args: ['[hl]', 'c'],
                opcode: 0x71
            },
            {
                args: ['[hl]', 'd'],
                opcode: 0x72
            },
            {
                args: ['[hl]', 'e'],
                opcode: 0x73
            },
            {
                args: ['[hl]', 'h'],
                opcode: 0x74
            },
            {
                args: ['[hl]', 'l'],
                opcode: 0x75
            },
            {
                args: ['[hl]', 'n8'],
                opcode: 0x36
            },
            {
                args: ['[hl+]', 'a'],
                opcode: 0x22
            },
            {
                args: ['[hli]', 'a'],
                opcode: 0x22
            },
            {
                args: ['[hl-]', 'a'],
                opcode: 0x32
            },
            {
                args: ['[hld]', 'a'],
                opcode: 0x32
            },
            {
                args: ['[$FF00+c]', 'a'],
                opcode: 0xE2
            },
            {
                args: ['[$FF00+n8]', 'a'],
                opcode: 0xE0
            },
            {
                args: ['[n16]', 'a'],
                opcode: 0xEA
            },
            {
                args: ['[n16]', 'sp'],
                opcode: 0x08
            }
        ],
        ldi: [
            {
                args: ['[hl]', 'a'],
                opcode: 0x22
            },
            {
                args: ['a', '[hl]'],
                opcode: 0x2A
            }
        ],
        ldd: [
            {
                args: ['[hl]', 'a'],
                opcode: 0x32
            },
            {
                args: ['a', '[hl]'],
                opcode: 0x3A
            }
        ],
        ldh: [
            {
                args: ['[$FF00+n8]', 'a'],
                opcode: 0xE0
            },
            {
                args: ['a', '[$FF00+n8]'],
                opcode: 0xF0
            },
            {
                args: ['[n8]', 'a'],
                opcode: 0xE0
            },
            {
                args: ['a', '[n8]'],
                opcode: 0xF0
            }
        ],
        ldhl: [
            {
                args: ['sp', 'e8'],
                opcode: 0xF8
            }
        ],
        call: [
            {
                args: ['n16'],
                opcode: 0xCD
            },
            {
                args: ['C', 'n16'],
                opcode: 0xDC
            },
            {
                args: ['NC', 'n16'],
                opcode: 0xD4
            },
            {
                args: ['Z', 'n16'],
                opcode: 0xCC
            },
            {
                args: ['NZ', 'n16'],
                opcode: 0xC4
            }
        ],
        jp: [
            {
                args: ['hl'],
                opcode: 0xE9
            },
            {
                args: ['n16'],
                opcode: 0xC3
            },
            {
                args: ['C', 'n16'],
                opcode: 0xDA
            },
            {
                args: ['NC', 'n16'],
                opcode: 0xD2
            },
            {
                args: ['Z', 'n16'],
                opcode: 0xCA
            },
            {
                args: ['NZ', 'n16'],
                opcode: 0xC2
            }
        ],
        jr: [
            {
                args: ['e8'],
                opcode: 0x18
            },
            {
                args: ['C', 'e8'],
                opcode: 0x38
            },
            {
                args: ['NC', 'e8'],
                opcode: 0x30
            },
            {
                args: ['Z', 'e8'],
                opcode: 0x28
            },
            {
                args: ['NZ', 'e8'],
                opcode: 0x20
            }
        ],
        ret: [
            {
                args: ['C'],
                opcode: 0xD8
            },
            {
                args: ['NC'],
                opcode: 0xD0
            },
            {
                args: ['Z'],
                opcode: 0xC8
            },
            {
                args: ['NZ'],
                opcode: 0xC0
            },
            {
                args: [],
                opcode: 0xC9
            }
        ],
        reti: [
            {
                args: [],
                opcode: 0xD9
            }
        ],
        rst: [
            {
                args: ['vec'],
                opcode: 0xC7
            }
        ],
        pop: [
            {
                args: ['af'],
                opcode: 0xF1
            },
            {
                args: ['bc'],
                opcode: 0xC1
            },
            {
                args: ['de'],
                opcode: 0xD1
            },
            {
                args: ['hl'],
                opcode: 0xE1
            }
        ],
        push: [
            {
                args: ['af'],
                opcode: 0xF5
            },
            {
                args: ['bc'],
                opcode: 0xC5
            },
            {
                args: ['de'],
                opcode: 0xD5
            },
            {
                args: ['hl'],
                opcode: 0xE5
            }
        ],
        ccf: [
            {
                args: [],
                opcode: 0x3F
            }
        ],
        cpl: [
            {
                args: [],
                opcode: 0x2F
            }
        ],
        daa: [
            {
                args: [],
                opcode: 0x27
            }
        ],
        scf: [
            {
                args: [],
                opcode: 0x37
            }
        ],
        di: [
            {
                args: [],
                opcode: 0xF3
            }
        ],
        ei: [
            {
                args: [],
                opcode: 0xFB
            }
        ],
        halt: [
            {
                args: [],
                opcode: 0x76
            }
        ],
        nop: [
            {
                args: [],
                opcode: 0x00
            }
        ],
        stop: [
            {
                args: [],
                opcode: 0x00,
                prefix: 0x10
            }
        ]
    }

    public evalRules: { [key: number]: EvaluatorRule } = {
        [NodeType.unary_operator]: (state, op, label, ctx) => {
            if (op.token.value === '=') {
                const labelId = label ? label.token.value.replace(/:/g, '') : ''
                return {
                    ...state,
                    sets: {
                        ...state.sets,
                        [labelId]: this.calcConstExpr(op.children[0], 'number', ctx)
                    }
                }
            }
            this.error('No unary operator evaluation rule matches', op.token, ctx)
            return { ...state }
        },
        [NodeType.keyword]: (state, op, label, ctx) => {
            const labelId = label ? label.token.value.replace(/:/g, '') : ''
            const lineNumber = ctx.line.getLineNumber()
            switch (op.token.value.toLowerCase()) {
                case 'equ': {
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    if (state.numberEquates && state.numberEquates[labelId]) {
                        this.error(`Cannot redefine existing equate "${labelId}"`, op.token, ctx)
                        return { ...state }
                    }
                    this.compiler.logger.log('defineSymbol', 'Define number equate', labelId, 'as', this.calcConstExpr(op.children[0], 'number', ctx).toString())
                    return {
                        ...state,
                        numberEquates: {
                            ...state.numberEquates,
                            [labelId]: this.calcConstExpr(op.children[0], 'number', ctx)
                        }
                    }
                }
                case 'equs': {
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    if (!labelId) {
                        this.error('Cannot define equate with no label', op.token, ctx)
                        return { ...state }
                    }
                    if (state.stringEquates && state.stringEquates[labelId]) {
                        this.error(`Cannot redefine existing equate "${labelId}"`, op.token, ctx)
                        return { ...state }
                    }
                    this.compiler.logger.log('defineSymbol', 'Define string equate', labelId, 'as', this.calcConstExpr(op.children[0], 'string', ctx))
                    return {
                        ...state,
                        stringEquates: {
                            ...state.stringEquates,
                            [labelId]: this.calcConstExpr(op.children[0], 'string', ctx)
                        }
                    }
                }
                case 'set': {
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    this.compiler.logger.log('defineSymbol', 'Define set', labelId, 'as', this.calcConstExpr(op.children[0], 'number', ctx).toString())
                    return {
                        ...state,
                        sets: {
                            ...state.sets,
                            [labelId]: this.calcConstExpr(op.children[0], 'number', ctx)
                        }
                    }
                }
                case 'charmap': {
                    if (op.children.length !== 2) {
                        this.error('Keyword needs exactly two arguments', op.token, ctx)
                        return { ...state }
                    }
                    const key = this.calcConstExpr(op.children[0], 'string', ctx)
                    const val = this.calcConstExpr(op.children[1], 'number', ctx)
                    return {
                        ...state,
                        charmaps: {
                            ...state.charmaps,
                            [key]: val
                        }
                    }
                }
                case 'if': {
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    return {
                        ...state,
                        inConditionals: [
                            {
                                condition: this.calcConstExpr(op.children[0], 'number', ctx) !== 0
                            },
                            ...state.inConditionals ? state.inConditionals : []
                        ]
                    }
                }
                case 'elif': {
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    if (!state.inConditionals || !state.inConditionals.length) {
                        this.error('No matching if or elif to continue', op.token, ctx)
                        return { ...state }
                    }
                    return {
                        ...state,
                        inConditionals: [
                            {
                                ...state.inConditionals[0],
                                condition: this.calcConstExpr(op.children[0], 'number', ctx) !== 0
                            },
                            ...state.inConditionals.slice(1)
                        ]
                    }
                }
                case 'else': {
                    if (!state.inConditionals || !state.inConditionals.length) {
                        this.error('No matching if or elif to continue', op.token, ctx)
                        return { ...state }
                    }
                    return {
                        ...state,
                        inConditionals: [
                            {
                                ...state.inConditionals[0],
                                condition: !state.inConditionals[0].condition
                            },
                            ...state.inConditionals.slice(1)
                        ]
                    }
                }
                case 'endc': {
                    if (!state.inConditionals || !state.inConditionals.length) {
                        this.error('No matching if, elif, or else to terminate', op.token, ctx)
                        return { ...state }
                    }
                    return {
                        ...state,
                        inConditionals: [
                            ...state.inConditionals.slice(1)
                        ]
                    }
                }
                case 'macro': {
                    if (state.macros && state.macros[labelId]) {
                        this.error('Cannot redefine macros', op.token, ctx)
                        return { ...state }
                    }
                    return {
                        ...state,
                        macros: {
                            ...state.macros,
                            [labelId]: {
                                id: labelId,
                                file: state.file,
                                startLine: lineNumber,
                                endLine: -1
                            }
                        },
                        inMacro: labelId
                    }
                }
                case 'endm': {
                    if (!state.inMacro || !state.macros) {
                        this.error('No macro definition found to terminate', op.token, ctx)
                        return { ...state }
                    }
                    return {
                        ...state,
                        macros: {
                            ...state.macros,
                            [state.inMacro]: {
                                ...state.macros[state.inMacro],
                                endLine: lineNumber
                            }
                        },
                        inMacro: undefined
                    }
                }
                case 'shift': {
                    if (!state.inMacroCalls) {
                        this.error('Must be in a macro call to shift macro arguments', op.token, ctx)
                        return { ...state }
                    }
                    return {
                        ...state,
                        inMacroCalls: [
                            {
                                ...state.inMacroCalls[0],
                                argOffset: state.inMacroCalls[0].argOffset + 1
                            },
                            ...state.inMacroCalls.slice(1)
                        ]
                    }
                }
                case 'rept': {
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    const count = this.calcConstExpr(op.children[0], 'number', ctx)
                    return {
                        ...state,
                        inRepeats: [
                            {
                                count,
                                line: ctx.line.getLineNumber(),
                                file: state.file
                            },
                            ...(state.inRepeats ? state.inRepeats : [])
                        ],
                        macroCounter: state.macroCounter ? state.macroCounter + 1 : 1
                    }
                }
                case 'endr': {
                    if (!state.inRepeats || !state.inRepeats.length) {
                        this.error('No matching rept to terminate', op.token, ctx)
                        return { ...state }
                    }
                    const count = state.inRepeats[0].count
                    const startLine = state.inRepeats[0].line + 1
                    const endLine = lineNumber - 1
                    let lastState: ILineState | undefined = { ...state }

                    for (let i = 1; i < count; i++) {
                        const file = new FileContext(ctx.line.file.context, ctx.line.file, ctx.line.file.source, `${ctx.line.file.scope}(${lineNumber + 1}):rept`, startLine, endLine)
                        const firstLine = file.lines[startLine]
                        const lastLine = file.lines[endLine]
                        firstLine.eval = new EvaluatorContext(ctx.options, firstLine, lastState)
                        this.compiler.compileFile(file, file.context.options)
                        if (lastLine.eval) {
                            lastState = lastLine.eval.afterState
                        }
                    }
                    if (lastState) {
                        return {
                            ...lastState,
                            inRepeats: lastState.inRepeats ? [...lastState.inRepeats.slice(1)] : [],
                            line: state.line,
                            file: state.file
                        }
                    }
                    return { ...state }
                }
                case 'union': {
                    if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                        this.error('Unions must be defined within a section', op.token, ctx)
                        return { ...state }
                    }
                    const section = state.sections[state.inSections[0]]
                    return {
                        ...state,
                        inUnions: [
                            {
                                byteOffset: section.bytes.length,
                                byteLength: 0
                            },
                            ...(state.inUnions ? state.inUnions : [])
                        ]
                    }
                }
                case 'nextu': {
                    if (!state.inUnions || !state.inUnions.length) {
                        this.error('No matching union to continue', op.token, ctx)
                        return { ...state }
                    }
                    if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                        this.error('Unions must be defined within a section', op.token, ctx)
                        return { ...state }
                    }
                    const union = state.inUnions[0]
                    const section = state.sections[state.inSections[0]]
                    return {
                        ...state,
                        inUnions: [
                            {
                                ...state.inUnions[0],
                                byteLength: Math.max(section.bytes.length - union.byteOffset, union.byteLength)
                            },
                            ...state.inUnions.slice(1)
                        ],
                        sections: {
                            ...state.sections,
                            [state.inSections[0]]: {
                                ...section,
                                bytes: section.bytes.slice(0, union.byteOffset)
                            }
                        }
                    }
                }
                case 'endu': {
                    if (!state.inUnions || !state.inUnions.length) {
                        this.error('No matching union to terminate', op.token, ctx)
                        return { ...state }
                    }
                    if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                        this.error('Unions must be defined within a section', op.token, ctx)
                        return { ...state }
                    }
                    const union = state.inUnions[0]
                    const section = state.sections[state.inSections[0]]
                    return {
                        ...state,
                        inUnions: [
                            ...state.inUnions.slice(1)
                        ],
                        sections: {
                            ...state.sections,
                            [state.inSections[0]]: {
                                ...section,
                                bytes: [
                                    ...section.bytes.slice(0, union.byteOffset),
                                    ...new Array(Math.max(section.bytes.length - union.byteOffset, union.byteLength)).fill(ctx.options.padding)
                                ]
                            }
                        }
                    }
                }
                case 'rsreset': {
                    return {
                        ...state,
                        rsCounter: 0
                    }
                }
                case 'rsset': {
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    return {
                        ...state,
                        rsCounter: this.calcConstExpr(op.children[0], 'number', ctx)
                    }
                }
                case 'rb': {
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    this.compiler.logger.log('defineSymbol', 'Define set', labelId, 'as', ((state.rsCounter ? state.rsCounter : 0) + this.calcConstExpr(op.children[0], 'number', ctx)).toString())
                    return {
                        ...state,
                        sets: {
                            ...state.sets,
                            [labelId]: state.rsCounter ? state.rsCounter : 0
                        },
                        rsCounter: (state.rsCounter ? state.rsCounter : 0) + this.calcConstExpr(op.children[0], 'number', ctx)
                    }
                }
                case 'rw': {
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    this.compiler.logger.log('defineSymbol', 'Define set', labelId, 'as', ((state.rsCounter ? state.rsCounter : 0) + this.calcConstExpr(op.children[0], 'number', ctx) * 2).toString())
                    return {
                        ...state,
                        sets: {
                            ...state.sets,
                            [labelId]: state.rsCounter ? state.rsCounter : 0
                        },
                        rsCounter: (state.rsCounter ? state.rsCounter : 0) + this.calcConstExpr(op.children[0], 'number', ctx) * 2
                    }
                }
                case 'rl': {
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    this.compiler.logger.log('defineSymbol', 'Define set', labelId, 'as', ((state.rsCounter ? state.rsCounter : 0) + this.calcConstExpr(op.children[0], 'number', ctx) * 4).toString())
                    return {
                        ...state,
                        sets: {
                            ...state.sets,
                            [labelId]: state.rsCounter ? state.rsCounter : 0
                        },
                        rsCounter: (state.rsCounter ? state.rsCounter : 0) + this.calcConstExpr(op.children[0], 'number', ctx) * 4
                    }
                }
                case 'ds': {
                    if (label) {
                        state = this.defineLabel(state, label, ctx)
                    }
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                        this.error('Cannot define bytes when not inside a section', op.token, ctx)
                        return { ...state }
                    }
                    return {
                        ...state,
                        sections: {
                            ...state.sections,
                            [state.inSections[0]]: {
                                ...state.sections[state.inSections[0]],
                                bytes: [
                                    ...state.sections[state.inSections[0]].bytes,
                                    ...new Array(this.calcConstExpr(op.children[0], 'number', ctx)).fill(ctx.options.padding)
                                ]
                            }
                        }
                    }
                }
                case 'db': {
                    if (label) {
                        state = this.defineLabel(state, label, ctx)
                    }
                    if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                        this.error('Cannot define bytes when not inside a section', op.token, ctx)
                        return { ...state }
                    }
                    if (op.children.length > 0) {
                        let s: ILineState = { ...state }
                        for (const child of op.children) {
                            const hole: ILinkHole = {
                                line: ctx.line,
                                node: child,
                                section: state.inSections[0],
                                byteOffset: state.sections[state.inSections[0]].bytes.length,
                                byteLength: 1
                            }
                            let arg = this.calcConstExprOrHole(hole, child, 'either', ctx)
                            if (typeof arg === 'string') {
                                if (state.charmaps) {
                                    const arr: number[] = []
                                    const keys = Object.keys(state.charmaps).sort((a, b) => b.length - a.length)
                                    for (let i = 0; i < arg.length; i++) {
                                        const key = keys.find((str) => (arg as string).substr(i, str.length) === str)
                                        if (key) {
                                            arr.push(state.charmaps[key])
                                            i += key.length - 1
                                        } else {
                                            arr.push(arg.charCodeAt(i))
                                        }
                                    }
                                    arg = arr.map((n) => String.fromCharCode(n)).join('')
                                }
                            }
                            if (s.sections && s.inSections) {
                                s = {
                                    ...s,
                                    sections: {
                                        ...s.sections,
                                        [s.inSections[0]]: {
                                            ...s.sections[s.inSections[0]],
                                            bytes: [
                                                ...s.sections[s.inSections[0]].bytes,
                                                ...(typeof arg === 'string' ? arg.split('').map((c) => c.charCodeAt(0) & 0xFF) : [arg & 0xFF])
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                        return s
                    }
                    return {
                        ...state,
                        sections: {
                            ...state.sections,
                            [state.inSections[0]]: {
                                ...state.sections[state.inSections[0]],
                                bytes: [
                                    ...state.sections[state.inSections[0]].bytes,
                                    ...[ctx.options.padding]
                                ]
                            }
                        }
                    }
                }
                case 'dw': {
                    if (label) {
                        state = this.defineLabel(state, label, ctx)
                    }
                    if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                        this.error('Cannot define bytes when not inside a section', op.token, ctx)
                        return { ...state }
                    }
                    if (op.children.length > 0) {
                        let s: ILineState = { ...state }
                        for (const child of op.children) {
                            const hole: ILinkHole = {
                                line: ctx.line,
                                node: child,
                                section: state.inSections[0],
                                byteOffset: state.sections[state.inSections[0]].bytes.length,
                                byteLength: 2
                            }
                            const arg = this.calcConstExprOrHole(hole, child, 'number', ctx)
                            if (s.sections && s.inSections) {
                                s = {
                                    ...s,
                                    sections: {
                                        ...s.sections,
                                        [s.inSections[0]]: {
                                            ...s.sections[s.inSections[0]],
                                            bytes: [
                                                ...s.sections[s.inSections[0]].bytes,
                                                ...[(arg & 0x00FF) >>> 0, (arg & 0xFF00) >>> 8]
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                        return s
                    }
                    return {
                        ...state,
                        sections: {
                            ...state.sections,
                            [state.inSections[0]]: {
                                ...state.sections[state.inSections[0]],
                                bytes: [
                                    ...state.sections[state.inSections[0]].bytes,
                                    ...[ctx.options.padding, ctx.options.padding]
                                ]
                            }
                        }
                    }
                }
                case 'dl': {
                    if (label) {
                        state = this.defineLabel(state, label, ctx)
                    }
                    if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                        this.error('Cannot define bytes when not inside a section', op.token, ctx)
                        return { ...state }
                    }
                    for (const child of op.children) {
                        this.error('Help', child.token, ctx)
                    }
                    if (op.children.length > 0) {
                        let s: ILineState = { ...state }
                        for (const child of op.children) {
                            const hole: ILinkHole = {
                                line: ctx.line,
                                node: child,
                                section: state.inSections[0],
                                byteOffset: state.sections[state.inSections[0]].bytes.length,
                                byteLength: 4
                            }
                            const arg = this.calcConstExprOrHole(hole, child, 'number', ctx)
                            if (s.sections && s.inSections) {
                                s = {
                                    ...s,
                                    sections: {
                                        ...s.sections,
                                        [s.inSections[0]]: {
                                            ...s.sections[s.inSections[0]],
                                            bytes: [
                                                ...s.sections[s.inSections[0]].bytes,
                                                ...[(arg & 0x000000FF) >>> 0, (arg & 0x0000FF00) >>> 8, (arg & 0x00FF0000) >>> 16, (arg & 0xFF000000) >>> 24]
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                        return s
                    }
                    return {
                        ...state,
                        sections: {
                            ...state.sections,
                            [state.inSections[0]]: {
                                ...state.sections[state.inSections[0]],
                                bytes: [
                                    ...state.sections[state.inSections[0]].bytes,
                                    ...[ctx.options.padding, ctx.options.padding, ctx.options.padding, ctx.options.padding]
                                ]
                            }
                        }
                    }
                }
                case 'include': {
                    if (label) {
                        state = this.defineLabel(state, label, ctx)
                    }
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    const inc = ctx.line.file.context.includeFiles.find((incFile) => incFile.path.endsWith(this.calcConstExpr(op.children[0], 'string', ctx)))
                    if (!inc) {
                        this.error('Could not find a matching file to include', op.token, ctx)
                        return { ...state }
                    }
                    const file = new FileContext(ctx.line.file.context, ctx.line.file, inc, `${ctx.line.file.scope}(${lineNumber + 1}):${inc.path}`)
                    const firstLine = file.lines[0]
                    const lastLine = file.lines[file.lines.length - 1]
                    firstLine.eval = new EvaluatorContext(ctx.options, firstLine, state)
                    this.compiler.compileFile(file, file.context.options)
                    if (lastLine.eval) {
                        return {
                            ...lastLine.eval.afterState,
                            line: state.line,
                            file: state.file
                        }
                    }
                    return { ...state }
                }
                case 'incbin': {
                    if (label) {
                        state = this.defineLabel(state, label, ctx)
                    }
                    if (op.children.length !== 1 && op.children.length !== 3) {
                        this.error('Keyword needs exactly one or exactly three arguments', op.token, ctx)
                    }
                    if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                        this.error('Cannot include binary data when not inside a section', op.token, ctx)
                        return { ...state }
                    }
                    const inc = ctx.line.file.context.includeFiles.find((incFile) => incFile.path.endsWith(this.calcConstExpr(op.children[0], 'string', ctx)))
                    if (!inc) {
                        this.error('Could not find a matching file to include', op.token, ctx)
                        return { ...state }
                    }
                    const data = new Uint8Array(inc.buffer)
                    const startOffset = op.children.length === 3 ? this.calcConstExpr(op.children[1], 'number', ctx) : 0
                    const endOffset = op.children.length === 3 ? startOffset + this.calcConstExpr(op.children[2], 'number', ctx) : data.byteLength
                    return {
                        ...state,
                        sections: {
                            ...state.sections,
                            [state.inSections[0]]: {
                                ...state.sections[state.inSections[0]],
                                bytes: [
                                    ...state.sections[state.inSections[0]].bytes,
                                    ...data.slice(startOffset, endOffset)
                                ]
                            }
                        }
                    }

                }
                case 'export':
                case 'global': {
                    if (!op.children.length) {
                        this.error('Keyword needs at least one argument', op.token, ctx)
                        return { ...state }
                    }
                    let s = { ...state }
                    for (const child of op.children) {
                        const id = child.token.value
                        if (!s.labels || !s.labels[id]) {
                            this.error('Label is not defined', child.token, ctx)
                            continue
                        }
                        s = {
                            ...s,
                            labels: {
                                ...s.labels,
                                [id]: {
                                    ...s.labels[id],
                                    exported: true
                                }
                            }
                        }
                    }
                    return s
                }
                case 'purge': {
                    if (!op.children.length) {
                        this.error('Keyword needs at least one argument', op.token, ctx)
                        return { ...state }
                    }
                    let s: ILineState = {
                        ...state,
                        stringEquates: { ...state.stringEquates },
                        numberEquates: { ...state.numberEquates },
                        sets: { ...state.sets },
                        macros: { ...state.macros }
                    }
                    for (const child of op.children) {
                        const id = child.token.value
                        let purged = false
                        if (s.stringEquates && s.stringEquates[id]) {
                            const { [id]: _, ...stringEquates } = s.stringEquates
                            s = { ...s, stringEquates }
                            this.compiler.logger.log('purgeSymbol', 'Purge string equate', id)
                            purged = true
                        }
                        if (s.numberEquates && s.numberEquates[id]) {
                            const { [id]: _, ...numberEquates } = s.numberEquates
                            s = { ...s, numberEquates }
                            this.compiler.logger.log('purgeSymbol', 'Purge string equate', id)
                            purged = true
                        }
                        if (s.sets && s.sets[id]) {
                            const { [id]: _, ...sets } = s.sets
                            s = { ...s, sets }
                            this.compiler.logger.log('purgeSymbol', 'Purge string equate', id)
                            purged = true
                        }
                        if (s.macros && s.macros[id]) {
                            const { [id]: _, ...macros } = s.macros
                            s = { ...s, macros }
                            this.compiler.logger.log('purgeSymbol', 'Purge string equate', id)
                            purged = true
                        }
                        if (!purged) {
                            this.error('No symbol exists to purge', child.token, ctx)
                        }
                    }
                    return s
                }
                case 'section': {
                    if (op.children.length === 0) {
                        this.error('Sections must be given a name', op.token, ctx)
                        return { ...state }
                    }
                    if (op.children.length === 1) {
                        this.error('Sections must specify a memory region', op.token, ctx)
                        return { ...state }
                    }
                    const id = this.calcConstExpr(op.children[0], 'string', ctx)
                    const regionOp = op.children[1]
                    const bankOp = op.children.find((n) => n.token.value.toLowerCase() === 'bank')
                    if (bankOp && bankOp.children.length !== 1) {
                        this.error('Bank number must be specified', bankOp.token, ctx)
                        return { ...state }
                    }
                    const alignOp = op.children.find((n) => n.token.value.toLowerCase() === 'align')
                    if (alignOp && alignOp.children.length !== 1) {
                        this.error('Alignment number must be specified', alignOp.token, ctx)
                        return { ...state }
                    }
                    return {
                        ...state,
                        sections: {
                            ...state.sections,
                            [id]: {
                                id,
                                file: state.file,
                                bytes: [],
                                startLine: lineNumber,
                                region: regionOp.token.value.toLowerCase(),
                                fixedAddress: (regionOp.children.length ? this.calcConstExpr(regionOp.children[0], 'number', ctx) : undefined),
                                bank: (bankOp ? this.calcConstExpr(bankOp.children[0], 'number', ctx) : undefined),
                                alignment: (alignOp ? this.calcConstExpr(alignOp.children[0], 'number', ctx) : undefined)
                            }
                        },
                        inSections: [
                            id,
                            ...(state.inSections ? state.inSections.slice(1) : [])
                        ]
                    }
                }
                case 'pushs': {
                    return {
                        ...state,
                        inSections: [
                            '',
                            ...(state.inSections ? state.inSections : [])
                        ]
                    }
                }
                case 'pops': {
                    if (!state.inSections || !state.inSections.length || !state.inSections[0]) {
                        this.error('Cannot pop from empty section stack', op.token, ctx)
                        return { ...state }
                    }
                    return {
                        ...state,
                        inSections: state.inSections.slice(1)
                    }
                }
                case 'opt': {
                    let s: ILineState = { ...state }
                    for (const child of op.children) {
                        switch (child.token.value.charAt(0)) {
                            case 'g': {
                                s = {
                                    ...s,
                                    options: [
                                        {
                                            ...(s.options ? s.options[0] : {}),
                                            g: child.token.value.substr(1)
                                        },
                                        ...(s.options ? s.options.slice(1) : [])
                                    ]
                                }
                                continue
                            }
                            case 'b': {
                                s = {
                                    ...s,
                                    options: [
                                        {
                                            ...(s.options ? s.options[0] : {}),
                                            b: child.token.value.substr(1)
                                        },
                                        ...(s.options ? s.options.slice(1) : [])
                                    ]
                                }
                                continue
                            }
                            default: {
                                this.error('Unknown option', child.token, ctx)
                            }
                        }
                    }
                    return s
                }
                case 'pusho': {
                    return {
                        ...state,
                        options: [
                            {},
                            ...(state.options ? state.options : [])
                        ]
                    }
                }
                case 'popo': {
                    if (!state.options || !state.options.length) {
                        this.error('Cannot pop from empty option stack', op.token, ctx)
                        return { ...state }
                    }
                    return {
                        ...state,
                        options: state.options.slice(1)
                    }
                }
                case 'warn': {
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    this.warn(this.calcConstExpr(op.children[0], 'string', ctx), undefined, ctx)
                    return { ...state }
                }
                case 'fail': {
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    this.error(this.calcConstExpr(op.children[0], 'string', ctx), undefined, ctx)
                    return { ...state }
                }
                case 'printt': {
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    this.info(this.calcConstExpr(op.children[0], 'string', ctx), undefined, ctx)
                    return { ...state }
                }
                case 'printv': {
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    this.info(`$${this.calcConstExpr(op.children[0], 'number', ctx).toString(16).toUpperCase()}`, undefined, ctx)
                    return { ...state }
                }
                case 'printi': {
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    this.info(`${this.calcConstExpr(op.children[0], 'number', ctx)}`, undefined, ctx)
                    return { ...state }
                }
                case 'printf': {
                    if (op.children.length !== 1) {
                        this.error('Keyword needs exactly one argument', op.token, ctx)
                        return { ...state }
                    }
                    this.info(`${this.calcConstExpr(op.children[0], 'number', ctx) / 65536}`, undefined, ctx)
                    return { ...state }
                }
            }
            this.error('No keyword evaluation rule matches', op.token, ctx)
            return { ...state }
        },
        [NodeType.opcode]: (state, op, label, ctx) => {
            if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
                this.error('Instructions must be placed within a section', op.token, ctx)
                return { ...state }
            }

            const sectionId = state.inSections[0]
            const sectionLength = state.sections[state.inSections[0]].bytes.length

            if (label) {
                state = this.defineLabel(state, label, ctx)
            }

            const rule = this.opRules[op.token.value.toLowerCase()]
            if (!rule) {
                this.error('Unimplemented opcode', op.token, ctx)
                return { ...state }
            }

            if (!rule.some((variant) => variant.args.length === op.children.length)) {
                this.error('Incorrect number of arguments', op.token, ctx)
                return { ...state }
            }

            for (const variant of rule) {
                let matches = true

                if (op.children.length !== variant.args.length) {
                    continue
                }

                for (let i = 0; i < variant.args.length; i++) {
                    const child = op.children[i]
                    const arg = variant.args[i]

                    switch (arg) {
                        case 'a':
                        case 'b':
                        case 'c':
                        case 'd':
                        case 'e':
                        case 'h':
                        case 'l':
                        case 'af':
                        case 'bc':
                        case 'de':
                        case 'hl':
                        case 'sp': {
                            if (child.type === NodeType.function_call && child.children.length === 2 && child.children[0].token.value.toLowerCase() === 'high') {
                                matches = matches && child.children[1].token.value.substr(0, 1).toLowerCase() === arg
                            } else if (child.type === NodeType.function_call && child.children.length === 2 && child.children[0].token.value.toLowerCase() === 'low') {
                                matches = matches && child.children[1].token.value.substr(1, 1).toLowerCase() === arg
                            } else {
                                matches = matches && child.token.value.toLowerCase() === arg
                            }
                            break
                        }
                        case 'C':
                        case 'NC':
                        case 'Z':
                        case 'NZ':
                            matches = matches && child.token.value.toUpperCase() === arg
                            break
                        case '[c]':
                        case '[bc]':
                        case '[de]':
                        case '[hl]':
                        case '[hl+]':
                        case '[hl-]':
                        case '[hli]':
                        case '[hld]':
                            matches = matches && child.type === NodeType.indexer && child.children[0].token.value.toLowerCase() === arg.substring(1, arg.length - 1)
                            break
                        case 'n8':
                        case 'n16':
                        case 'e8':
                            matches = matches && this.isExpr(child)
                            break
                        case 'u3': {
                            const val = this.isExpr(child) ? this.calcConstExpr(child, 'number', ctx) : -1
                            matches = matches && val >= 0 && val <= 7
                            break
                        }
                        case 'vec': {
                            const val = this.isExpr(child) ? this.calcConstExpr(child, 'number', ctx) : -1
                            matches = matches && (val === 0x00 || val === 0x08 || val === 0x10 || val === 0x18 || val === 0x20 || val === 0x28 || val === 0x30 || val === 0x38)
                            break
                        }
                        case '[n8]':
                        case '[n16]':
                            matches = matches && child.type === NodeType.indexer && this.isExpr(child.children[0])
                            break
                        case 'sp+e8':
                            matches = matches && child.token.value === '+' && child.children[0].token.value.toLowerCase() === 'sp' && this.isExpr(child.children[1])
                            break
                        case '[$FF00+c]':
                            matches = matches && child.type === NodeType.indexer && child.children[0].token.value === '+' && child.children[0].children[0].token.value.toLowerCase() === '$ff00' && child.children[0].children[1].token.value.toLowerCase() === 'c'
                            break
                        case '[$FF00+n8]': {
                            const val = child.type === NodeType.indexer && this.isExpr(child.children[0]) && this.isConstExpr(child.children[0], ctx) ? this.calcConstExpr(child.children[0], 'number', ctx) : -1
                            matches = matches && val >= 0xFF00 && val <= 0xFFFF
                            break
                        }
                    }
                    if (!matches) {
                        break
                    }
                }
                if (matches) {
                    const bytes = []
                    if (variant.prefix) {
                        bytes.push(variant.prefix)
                    }
                    let opcode = variant.opcode
                    for (let i = 0; i < variant.args.length; i++) {
                        switch (variant.args[i]) {
                            case 'u3':
                                opcode += 8 * this.calcConstExpr(op.children[i], 'number', ctx)
                                break
                            case 'vec':
                                opcode += this.calcConstExpr(op.children[i], 'number', ctx)
                                break
                        }
                    }
                    bytes.push(opcode)
                    for (let i = 0; i < variant.args.length; i++) {
                        switch (variant.args[i]) {
                            case 'n8': {
                                const hole: ILinkHole = {
                                    line: ctx.line,
                                    node: op.children[i],
                                    section: sectionId,
                                    byteOffset: sectionLength + bytes.length,
                                    byteLength: 1
                                }
                                const val = this.calcConstExprOrHole(hole, op.children[i], 'number', ctx)
                                bytes.push(val & 0xFF)
                                break
                            }
                            case 'n16': {
                                const hole: ILinkHole = {
                                    line: ctx.line,
                                    node: op.children[i],
                                    section: sectionId,
                                    byteOffset: sectionLength + bytes.length,
                                    byteLength: 2
                                }
                                const val = this.calcConstExprOrHole(hole, op.children[i], 'number', ctx)
                                bytes.push((val & 0x00FF) >>> 0, (val & 0xFF00) >>> 8)
                                break
                            }
                            case 'e8': {
                                const hole: ILinkHole = {
                                    line: ctx.line,
                                    node: op.children[i],
                                    section: sectionId,
                                    byteOffset: sectionLength + bytes.length,
                                    byteLength: 1,
                                    relative: true
                                }
                                const val = this.calcConstExprOrHole(hole, op.children[i], 'number', ctx)
                                bytes.push(val & 0xFF)
                                break
                            }
                            case '[n8]': {
                                const hole: ILinkHole = {
                                    line: ctx.line,
                                    node: op.children[i].children[0],
                                    section: sectionId,
                                    byteOffset: sectionLength + bytes.length,
                                    byteLength: 1
                                }
                                const val = this.calcConstExprOrHole(hole, op.children[i].children[0], 'number', ctx)
                                bytes.push(val & 0xFF)
                                break
                            }
                            case '[n16]': {
                                const hole: ILinkHole = {
                                    line: ctx.line,
                                    node: op.children[i].children[0],
                                    section: sectionId,
                                    byteOffset: sectionLength + bytes.length,
                                    byteLength: 2
                                }
                                const val = this.calcConstExprOrHole(hole, op.children[i].children[0], 'number', ctx)
                                bytes.push((val & 0x00FF) >>> 0, (val & 0xFF00) >>> 8)
                                break
                            }
                            case '[$FF00+n8]': {
                                const val = this.calcConstExpr(op.children[i].children[0], 'number', ctx)
                                bytes.push(val & 0xFF)
                                break
                            }
                        }
                    }
                    if (ctx.options.nopAfterHalt && op.token.value.toLowerCase() === 'halt') {
                        bytes.push(0x00)
                    }
                    return {
                        ...state,
                        sections: {
                            ...state.sections,
                            [sectionId]: {
                                ...state.sections![sectionId],
                                bytes: [
                                    ...state.sections![sectionId].bytes,
                                    ...bytes
                                ]
                            }
                        }
                    }
                }
            }
            this.error('No matching instruction variant', op.token, ctx)
            return { ...state }
        },
        [NodeType.macro_call]: (state, op, label, ctx) => {
            if (label) {
                state = this.defineLabel(state, label, ctx)
            }
            if (!state.macros || !state.macros[op.token.value]) {
                this.error('Unimplemented macro call', op.token, ctx)
                return { ...state }
            }
            const macro = state.macros[op.token.value]
            const startLine = macro.startLine + 1
            const endLine = macro.endLine - 1
            const srcFile = ctx.line.file.source.path === macro.file ? ctx.line.file.source : ctx.line.file.context.includeFiles.find((inc) => inc.path === macro.file)
            if (!srcFile) {
                this.error('Macro exists in out-of-scope source file', op.token, ctx)
                return { ...state }
            }
            const file = new FileContext(ctx.line.file.context, ctx.line.file, srcFile, `${ctx.line.file.scope}(${ctx.line.getLineNumber() + 1}):${srcFile.path}`, startLine, endLine)
            const firstLine = file.lines[startLine]
            const lastLine = file.lines[endLine]
            firstLine.eval = new EvaluatorContext(ctx.options, firstLine, {
                ...state,
                inMacroCalls: [
                    {
                        id: op.token.value,
                        args: op.children.map((n) => n.token.value),
                        argOffset: 0
                    },
                    ...(state.inMacroCalls ? state.inMacroCalls : [])
                ],
                macroCounter: state.macroCounter ? state.macroCounter + 1 : 1
            })
            this.compiler.compileFile(file, file.context.options)
            if (lastLine.eval) {
                return {
                    ...lastLine.eval.afterState,
                    inMacroCalls: lastLine.eval.afterState.inMacroCalls ? [...lastLine.eval.afterState.inMacroCalls.slice(1)] : [],
                    line: state.line,
                    file: state.file
                }
            }
            return { ...state }
        }
    }

    public constExprRules: { [key: string]: ConstExprRule } = {
        '!': (op, ctx) => {
            if (op.children.length === 1) {
                return this.calcConstExpr(op.children[0], 'number', ctx) === 0 ? 1 : 0
            } else {
                this.error('Operation needs right argument', op.token, ctx)
                return 0
            }
        },
        '~': (op, ctx) => {
            if (op.children.length === 1) {
                return ~this.calcConstExpr(op.children[0], 'number', ctx)
            } else {
                this.error('Operation needs right argument', op.token, ctx)
                return 0
            }
        },
        '+': (op, ctx) => {
            if (op.children.length === 2) {
                return (this.calcConstExpr(op.children[0], 'number', ctx) + this.calcConstExpr(op.children[1], 'number', ctx)) | 0
            } else if (op.children.length === 1) {
                return this.calcConstExpr(op.children[0], 'number', ctx) | 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '-': (op, ctx) => {
            if (op.children.length === 2) {
                if (ctx.beforeState.labels && op.children[0].type === NodeType.identifier && op.children[1].type === NodeType.identifier) {
                    const left = ctx.beforeState.labels[op.children[0].token.value]
                    const right = ctx.beforeState.labels[op.children[1].token.value]
                    if (left && right && left.section === right.section) {
                        return left.byteOffset - right.byteOffset
                    }
                }
                return (this.calcConstExpr(op.children[0], 'number', ctx) - this.calcConstExpr(op.children[1], 'number', ctx)) | 0
            } else if (op.children.length === 1) {
                return -(this.calcConstExpr(op.children[0], 'number', ctx) | 0)
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '*': (op, ctx) => {
            if (op.children.length === 2) {
                return (this.calcConstExpr(op.children[0], 'number', ctx) * this.calcConstExpr(op.children[1], 'number', ctx)) | 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '/': (op, ctx) => {
            if (op.children.length === 2) {
                return (this.calcConstExpr(op.children[0], 'number', ctx) / this.calcConstExpr(op.children[1], 'number', ctx)) | 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '%': (op, ctx) => {
            if (op.children.length === 2) {
                return (this.calcConstExpr(op.children[0], 'number', ctx) % this.calcConstExpr(op.children[1], 'number', ctx)) | 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '<<': (op, ctx) => {
            if (op.children.length === 2) {
                return this.calcConstExpr(op.children[0], 'number', ctx) << this.calcConstExpr(op.children[1], 'number', ctx)
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '>>': (op, ctx) => {
            if (op.children.length === 2) {
                return this.calcConstExpr(op.children[0], 'number', ctx) >>> this.calcConstExpr(op.children[1], 'number', ctx)
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '&': (op, ctx) => {
            if (op.children.length === 2) {
                return this.calcConstExpr(op.children[0], 'number', ctx) & this.calcConstExpr(op.children[1], 'number', ctx)
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '|': (op, ctx) => {
            if (op.children.length === 2) {
                return this.calcConstExpr(op.children[0], 'number', ctx) | this.calcConstExpr(op.children[1], 'number', ctx)
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '^': (op, ctx) => {
            if (op.children.length === 2) {
                return this.calcConstExpr(op.children[0], 'number', ctx) ^ this.calcConstExpr(op.children[1], 'number', ctx)
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '&&': (op, ctx) => {
            if (op.children.length === 2) {
                const a = this.calcConstExpr(op.children[0], 'number', ctx)
                const b = this.calcConstExpr(op.children[1], 'number', ctx)
                return (a !== 0 && b !== 0) ? 1 : 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '||': (op, ctx) => {
            if (op.children.length === 2) {
                const a = this.calcConstExpr(op.children[0], 'number', ctx)
                const b = this.calcConstExpr(op.children[1], 'number', ctx)
                return (a !== 0 || b !== 0) ? 1 : 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '==': (op, ctx) => {
            if (op.children.length === 2) {
                const a = this.calcConstExpr(op.children[0], 'either', ctx)
                const b = this.calcConstExpr(op.children[1], 'either', ctx)
                return (a === b) ? 1 : 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '!=': (op, ctx) => {
            if (op.children.length === 2) {
                const a = this.calcConstExpr(op.children[0], 'either', ctx)
                const b = this.calcConstExpr(op.children[1], 'either', ctx)
                return (a !== b) ? 1 : 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '<=': (op, ctx) => {
            if (op.children.length === 2) {
                const a = this.calcConstExpr(op.children[0], 'number', ctx)
                const b = this.calcConstExpr(op.children[1], 'number', ctx)
                return (a <= b) ? 1 : 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '>=': (op, ctx) => {
            if (op.children.length === 2) {
                const a = this.calcConstExpr(op.children[0], 'number', ctx)
                const b = this.calcConstExpr(op.children[1], 'number', ctx)
                return (a >= b) ? 1 : 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '<': (op, ctx) => {
            if (op.children.length === 2) {
                const a = this.calcConstExpr(op.children[0], 'number', ctx)
                const b = this.calcConstExpr(op.children[1], 'number', ctx)
                return (a < b) ? 1 : 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        '>': (op, ctx) => {
            if (op.children.length === 2) {
                const a = this.calcConstExpr(op.children[0], 'number', ctx)
                const b = this.calcConstExpr(op.children[1], 'number', ctx)
                return (a > b) ? 1 : 0
            } else {
                this.error('Operation needs both left and right arguments', op.token, ctx)
                return 0
            }
        },
        [TokenType.string]: (op, ctx) => {
            let source = op.token.value

            if (source.startsWith('"') && source.endsWith('"')) {
                source = source.substring(1, source.length - 1)
            }
            if (source.includes('\\') || source.includes('{')) {
                source = source.replace(/(?<!\\)\\"/g, '"')
                source = source.replace(/(?<!\\)\\,/g, ',')
                source = source.replace(/(?<!\\)\\{/g, '{')
                source = source.replace(/(?<!\\)\\}/g, '}')
                source = source.replace(/(?<!\\)\\n/g, '\n')
                source = source.replace(/(?<!\\)\\t/g, '\t')

                if (ctx.line.eval && ctx.line.eval.beforeState) {
                    let anyReplaced = true
                    while (anyReplaced) {
                        anyReplaced = false
                        if (ctx.line.eval.beforeState.sets) {
                            for (const key of Object.keys(ctx.line.eval.beforeState.sets)) {
                                const value = `$${ctx.line.eval.beforeState.sets[key].toString(16).toUpperCase()}`
                                const regex = new RegExp(`\\{${key}\\}`, 'g')
                                const newSource = this.applySourceReplace(source, regex, value)
                                if (source !== newSource) {
                                    source = newSource
                                    anyReplaced = true
                                }
                            }
                        }
                        if (ctx.line.eval.beforeState.numberEquates) {
                            for (const key of Object.keys(ctx.line.eval.beforeState.numberEquates)) {
                                const value = `$${ctx.line.eval.beforeState.numberEquates[key].toString(16).toUpperCase()} `
                                const regex = new RegExp(`\\{${key}\\}`, 'g')
                                const newSource = this.applySourceReplace(source, regex, value)
                                if (source !== newSource) {
                                    source = newSource
                                    anyReplaced = true
                                }
                            }
                        }
                        if (ctx.line.eval.beforeState.stringEquates) {
                            for (const key of Object.keys(ctx.line.eval.beforeState.stringEquates)) {
                                const value = ctx.line.eval.beforeState.stringEquates[key]
                                const regex = new RegExp(`\\{${key}\\}`, 'g')
                                const newSource = this.applySourceReplace(source, regex, value)
                                if (source !== newSource) {
                                    source = newSource
                                    anyReplaced = true
                                }
                            }
                        }
                        if (ctx.line.eval.beforeState.inMacroCalls && ctx.line.eval.beforeState.inMacroCalls.length) {
                            const macroCall = ctx.line.eval.beforeState.inMacroCalls[0]
                            for (let key = 1; key < 10; key++) {
                                const offset = key - 1 + macroCall.argOffset
                                const value = macroCall.args[offset] ? macroCall.args[offset] : ''
                                const regex = new RegExp(`\\\\${key}`, 'g')
                                const newSource = this.applySourceReplace(source, regex, value)
                                if (source !== newSource) {
                                    source = newSource
                                    anyReplaced = true
                                }
                            }
                        }
                        if (typeof ctx.line.eval.beforeState.macroCounter !== 'undefined') {
                            const value = `_${ctx.line.eval.beforeState.macroCounter}`
                            const regex = new RegExp(`\\\\@`, 'g')
                            const newSource = this.applySourceReplace(source, regex, value)
                            if (source !== newSource) {
                                source = newSource
                                anyReplaced = true
                            }
                        }
                    }
                }
            }

            if (source !== op.token.value) {
                this.compiler.logger.log('stringExpansion', 'String expansion of', op.token.value, 'to', source)
            }
            return source
        },
        [TokenType.open_paren]: (op, ctx) => {
            switch (op.children[0].token.value.toLowerCase()) {
                case 'div': {
                    if (op.children.length === 3) {
                        const a = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                        const b = this.calcConstExpr(op.children[2], 'number', ctx) / 65536
                        return Math.floor((a / b) * 65536)
                    } else {
                        this.error('Function needs exactly two arguments', op.children[0].token, ctx)
                        return 0
                    }
                }
                case 'mul': {
                    if (op.children.length === 3) {
                        const a = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                        const b = this.calcConstExpr(op.children[2], 'number', ctx) / 65536
                        return Math.floor((a * b) * 65536)
                    } else {
                        this.error('Function needs exactly two arguments', op.children[0].token, ctx)
                        return 0
                    }
                }
                case 'sin': {
                    if (op.children.length === 2) {
                        const n = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                        return Math.floor(Math.sin(n) * 65536)
                    } else {
                        this.error('Function needs exactly one argument', op.children[0].token, ctx)
                        return 0
                    }
                }
                case 'cos': {
                    if (op.children.length === 2) {
                        const n = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                        return Math.floor(Math.cos(n) * 65536)
                    } else {
                        this.error('Function needs exactly one argument', op.children[0].token, ctx)
                        return 0
                    }
                }
                case 'tan': {
                    if (op.children.length === 2) {
                        const n = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                        return Math.floor(Math.tan(n) * 65536)
                    } else {
                        this.error('Function needs exactly one argument', op.children[0].token, ctx)
                        return 0
                    }
                }
                case 'asin': {
                    if (op.children.length === 2) {
                        const n = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                        return Math.floor(Math.asin(n) * 65536)
                    } else {
                        this.error('Function needs exactly one argument', op.children[0].token, ctx)
                        return 0
                    }
                }
                case 'acos': {
                    if (op.children.length === 2) {
                        const n = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                        return Math.floor(Math.acos(n) * 65536)
                    } else {
                        this.error('Function needs exactly one argument', op.children[0].token, ctx)
                        return 0
                    }
                }
                case 'atan': {
                    if (op.children.length === 2) {
                        const n = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                        return Math.floor(Math.atan(n) * 65536)
                    } else {
                        this.error('Function needs exactly one argument', op.children[0].token, ctx)
                        return 0
                    }
                }
                case 'atan2': {
                    if (op.children.length === 3) {
                        const a = this.calcConstExpr(op.children[1], 'number', ctx) / 65536
                        const b = this.calcConstExpr(op.children[2], 'number', ctx) / 65536
                        return Math.floor(Math.atan2(b, a) * 65536)
                    } else {
                        this.error('Function needs exactly two arguments', op.children[0].token, ctx)
                        return 0
                    }
                }
                case 'strlen': {
                    if (op.children.length === 2) {
                        return this.calcConstExpr(op.children[1], 'string', ctx).length
                    } else {
                        this.error('Function needs exactly one argument', op.children[0].token, ctx)
                        return 0
                    }
                }
                case 'strcat': {
                    if (op.children.length === 3) {
                        const a = this.calcConstExpr(op.children[1], 'string', ctx)
                        const b = this.calcConstExpr(op.children[2], 'string', ctx)
                        return a + b
                    } else {
                        this.error('Function needs exactly two arguments', op.children[0].token, ctx)
                        return ''
                    }
                }
                case 'strcmp': {
                    if (op.children.length === 3) {
                        const a = this.calcConstExpr(op.children[1], 'string', ctx)
                        const b = this.calcConstExpr(op.children[2], 'string', ctx)
                        return a.localeCompare(b)
                    } else {
                        this.error('Function needs exactly two arguments', op.children[0].token, ctx)
                        return ''
                    }
                }
                case 'strin': {
                    if (op.children.length === 3) {
                        const a = this.calcConstExpr(op.children[1], 'string', ctx)
                        const b = this.calcConstExpr(op.children[2], 'string', ctx)
                        return a.indexOf(b) + 1
                    } else {
                        this.error('Function needs exactly two arguments', op.children[0].token, ctx)
                        return ''
                    }
                }
                case 'strsub': {
                    if (op.children.length === 4) {
                        const a = this.calcConstExpr(op.children[1], 'string', ctx)
                        const b = this.calcConstExpr(op.children[2], 'number', ctx)
                        const c = this.calcConstExpr(op.children[3], 'number', ctx)
                        return a.substr(b - 1, c)
                    } else {
                        this.error('Function needs exactly two arguments', op.children[0].token, ctx)
                        return ''
                    }
                }
                case 'strupr': {
                    if (op.children.length === 2) {
                        return this.calcConstExpr(op.children[1], 'string', ctx).toUpperCase()
                    } else {
                        this.error('Function needs exactly one argument', op.children[0].token, ctx)
                        return ''
                    }
                }
                case 'strlwr': {
                    if (op.children.length === 2) {
                        return this.calcConstExpr(op.children[1], 'string', ctx).toLowerCase()
                    } else {
                        this.error('Function needs exactly one argument', op.children[0].token, ctx)
                        return ''
                    }
                }
                case 'bank': {
                    const id = `${op.children[1].token.value.startsWith('.') ? ctx.beforeState.inLabel + op.children[1].token.value : op.children[1].token.value}__BANK`
                    if (ctx.beforeState.numberEquates && ctx.beforeState.numberEquates.hasOwnProperty(id)) {
                        return ctx.beforeState.numberEquates[id]
                    } else {
                        this.error('Bank is not known or no matching symbol', op.children[1].token, ctx)
                        return 0
                    }
                }
                case 'def': {
                    if (op.children.length === 2) {
                        const id = op.children[1].token.value
                        if (ctx.beforeState.labels && ctx.beforeState.labels[id]) {
                            return 1
                        }
                        if (ctx.beforeState.numberEquates && ctx.beforeState.numberEquates[id]) {
                            return 1
                        }
                        if (ctx.beforeState.stringEquates && ctx.beforeState.stringEquates[id]) {
                            return 1
                        }
                        if (ctx.beforeState.sets && ctx.beforeState.sets[id]) {
                            return 1
                        }
                        if (ctx.beforeState.macros && ctx.beforeState.macros[id]) {
                            return 1
                        }
                        return 0
                    } else {
                        this.error('Function needs exactly one argument', op.children[0].token, ctx)
                        return 0
                    }
                }
                case 'high': {
                    if (op.children.length === 2) {
                        return (this.calcConstExpr(op.children[1], 'number', ctx) & 0xFF00) >>> 8
                    } else {
                        this.error('Function needs exactly one argument', op.children[0].token, ctx)
                        return 0
                    }
                }
                case 'low': {
                    if (op.children.length === 2) {
                        return (this.calcConstExpr(op.children[1], 'number', ctx) & 0x00FF) >>> 0
                    } else {
                        this.error('Function needs exactly one argument', op.children[0].token, ctx)
                        return 0
                    }
                }
            }
            this.error('Unknown function name', op.children[0].token, ctx)
            return 0
        },
        [TokenType.open_bracket]: (op, ctx) => {
            return this.calcConstExpr(op.children[0], 'number', ctx)
        },
        [TokenType.identifier]: (op, ctx) => {
            const id = op.token.value.startsWith('.') ? ctx.beforeState.inLabel + op.token.value : op.token.value
            switch (id) {
                case '_NARG':
                    if (ctx.beforeState.inMacroCalls && ctx.beforeState.inMacroCalls.length) {
                        return ctx.beforeState.inMacroCalls[0].args.length
                    }
            }
            if (ctx.beforeState.numberEquates && ctx.beforeState.numberEquates.hasOwnProperty(id)) {
                return ctx.beforeState.numberEquates[id]
            } else if (ctx.beforeState.stringEquates && ctx.beforeState.stringEquates.hasOwnProperty(id)) {
                return ctx.beforeState.stringEquates[id]
            } else if (ctx.beforeState.sets && ctx.beforeState.sets.hasOwnProperty(id)) {
                return ctx.beforeState.sets[id]
            } else if (ctx.beforeState.labels && ctx.beforeState.labels.hasOwnProperty(id)) {
                this.error('Labels cannot be used in constant expressions', op.token, ctx)
                return 0
            } else {
                this.error('No matching symbol defined', op.token, ctx)
                return 0
            }
        },
        [TokenType.fixed_point_number]: (op) => {
            const bits = op.token.value.split('.')
            const high = parseInt(bits[0], 10)
            const low = parseInt(bits[1], 10)
            return (high << 16) | low
        },
        [TokenType.decimal_number]: (op) => {
            return parseInt(op.token.value, 10)
        },
        [TokenType.hex_number]: (op) => {
            return parseInt(op.token.value.substr(1), 16)
        },
        [TokenType.binary_number]: (op) => {
            return parseInt(op.token.value.substr(1), 2)
        },
        [TokenType.octal_number]: (op) => {
            return parseInt(op.token.value.substr(1), 8)
        }
    }

    constructor(public compiler: Compiler) {

    }

    public evaluate(line: LineContext, options: IEvaluatorOptions): EvaluatorContext {
        const ctx = new EvaluatorContext(options, line)

        const lineNumber = line.getLineNumber()

        ctx.beforeState = {
            ...(line.eval ? line.eval.beforeState : {}),
            line: lineNumber,
            file: line.file.source.path
        }

        if (!line.lex) {
            this.error('Line was evaluated before lexing, aborting', undefined, ctx)
            return ctx
        }

        if (!line.parse) {
            this.error('Line was evaluated before parsing, aborting', undefined, ctx)
            return ctx
        }

        const checkConditionals = !ctx.beforeState.inConditionals || !ctx.beforeState.inConditionals.length || ctx.beforeState.inConditionals.every((cond) => cond.condition) || (line.lex.tokens && line.lex.tokens.some((t) => t.value.toLowerCase() === 'if' || t.value.toLowerCase() === 'elif' || t.value.toLowerCase() === 'else' || t.value.toLowerCase() === 'endc'))

        ctx.afterState = checkConditionals ? this.evaluateLine(ctx.beforeState, line, ctx) : { ...ctx.beforeState }

        if (lineNumber < line.file.lines.length - 1) {
            line.file.lines[lineNumber + 1].eval = new EvaluatorContext(ctx.options, line.file.lines[lineNumber + 1], ctx.afterState)
        }

        line.eval = ctx

        return ctx
    }

    public evaluateLine(state: ILineState, line: LineContext, ctx: EvaluatorContext): ILineState {
        if (!line.parse || !line.parse.node || line.parse.node.children.length === 0) {
            return state
        }

        const children = [...line.parse.node.children]

        let label: Node | null = null
        let op: Node | null = null

        while (children.length > 0) {
            const child = children.pop()
            if (!child) {
                break
            } else if (child.type === NodeType.comment) {
                continue
            } else if (child.type === NodeType.label) {
                label = child
            } else {
                op = child
            }
        }

        if (op) {
            if (this.evalRules[op.type]) {
                state = this.evalRules[op.type](state, op, label, ctx)
            } else {
                if (NodeType[op.type] === TokenType[op.token.type]) {
                    this.error('No evaluator rule matches', op.token, ctx)
                } else {
                    this.error(`No evaluator rule matches for node type "${NodeType[op.type]}"`, op.token, ctx)
                }
            }
        } else if (label) {
            state = this.defineLabel(state, label, ctx)
        }

        return state
    }

    public calcConstExprOrHole(hole: ILinkHole, op: Node, expected: 'number', ctx: EvaluatorContext): number
    public calcConstExprOrHole(hole: ILinkHole, op: Node, expected: 'string', ctx: EvaluatorContext): string
    public calcConstExprOrHole(hole: ILinkHole, op: Node, expected: 'either', ctx: EvaluatorContext): number | string
    public calcConstExprOrHole(hole: ILinkHole, op: Node, expected: 'number' | 'string' | 'either', ctx: EvaluatorContext): number | string {
        const defaultValue = (expected === 'string') ? '' : 0
        if (this.isConstExpr(op, ctx)) {
            return this.calcConstExpr(op, expected as any, ctx)
        } else if (this.getConstExprType(op) === 'string') {
            this.error('String expressions must be constant', op.token, ctx)
            return defaultValue
        } else {
            ctx.line.file.context.holes.push(hole)
            return defaultValue
        }
    }

    public calcConstExpr(op: Node, expected: 'number', ctx: EvaluatorContext): number
    public calcConstExpr(op: Node, expected: 'string', ctx: EvaluatorContext): string
    public calcConstExpr(op: Node, expected: 'either', ctx: EvaluatorContext): number | string
    public calcConstExpr(op: Node, expected: 'number' | 'string' | 'either', ctx: EvaluatorContext): number | string {
        const defaultValue = (expected === 'string') ? '' : 0
        let rule = this.constExprRules[op.token.type]
        if (!rule) {
            rule = this.constExprRules[op.token.value.toLowerCase()]
        }
        if (rule) {
            let val = rule(op, ctx)
            if (expected === 'number' && typeof val === 'string') {
                if (ctx.beforeState && ctx.beforeState.charmaps && ctx.beforeState.charmaps.hasOwnProperty(val)) {
                    val = ctx.beforeState.charmaps[val]
                } else if (val.length === 1) {
                    val = val.charCodeAt(0)
                }
            }
            if (expected !== 'either' && typeof val !== expected) {
                this.error(`Constant expression does not evaluate to ${expected}`, op.token, ctx)
                return defaultValue
            }
            return val
        }
        this.error('No constant-expression rule matches', op.token, ctx)
        return defaultValue
    }

    public isExpr(op: Node): boolean {
        return !!this.constExprRules[op.token.type] || !!this.constExprRules[op.token.value.toLowerCase()]
    }

    public isConstExpr(op: Node, ctx: EvaluatorContext): boolean {
        if (op.type === NodeType.binary_operator && op.token.value === '-') {
            if (ctx.beforeState.labels && op.children[0].type === NodeType.identifier && op.children[1].type === NodeType.identifier) {
                const left = ctx.beforeState.labels[op.children[0].token.value]
                const right = ctx.beforeState.labels[op.children[1].token.value]
                if (left && right && left.section === right.section) {
                    return true
                }
            }
        }
        if (op.type === NodeType.identifier) {
            switch (op.token.value) {
                case '_NARG':
                    if (ctx.beforeState.inMacroCalls && ctx.beforeState.inMacroCalls.length) {
                        return true
                    }
            }
            if (ctx.beforeState.numberEquates && ctx.beforeState.numberEquates.hasOwnProperty(op.token.value)) {
                return true
            } else if (ctx.beforeState.stringEquates && ctx.beforeState.stringEquates.hasOwnProperty(op.token.value)) {
                return true
            } else if (ctx.beforeState.sets && ctx.beforeState.sets.hasOwnProperty(op.token.value)) {
                return true
            }
            return false
        }
        for (const child of op.children) {
            if (!this.isConstExpr(child, ctx)) {
                return false
            }
        }
        return true
    }

    public getConstExprType(op: Node): 'number' | 'string' {
        if (op.type === NodeType.string) {
            return 'string'
        }
        if (op.type === NodeType.function_call) {
            const func = op.children[0].token.value.toLowerCase()
            if (func === 'strcat' || func === 'strsub' || func === 'strupr' || func === 'strlwr') {
                return 'string'
            }
        }
        return 'number'
    }

    public defineLabel(state: ILineState, label: Node, ctx: EvaluatorContext): ILineState {
        const exported = label.token.value.endsWith('::')
        const local = label.token.value.includes('.')
        let labelId = label.token.value.replace(':', '').replace(':', '')
        if (local) {
            if (state.inLabel) {
                if (labelId.startsWith('.')) {
                    labelId = state.inLabel + labelId
                } else if (labelId.substr(0, labelId.indexOf('.')) !== state.inLabel) {
                    this.error('Local label defined within wrong global label', label.token, ctx)
                    return state
                }
            } else {
                this.error('Local label defined before any global labels', label.token, ctx)
                return state
            }
        }
        if (state.labels && state.labels[labelId]) {
            this.error('Label already defined', label.token, ctx)
            return state
        }
        if (!state.sections || !state.inSections || !state.inSections.length || !state.inSections[0]) {
            this.error('Labels must be defined within a section', label.token, ctx)
            return state
        }
        this.compiler.logger.log('defineSymbol', 'Define label', labelId)
        return {
            ...state,
            labels: {
                ...state.labels,
                [labelId]: {
                    id: labelId,
                    line: state.line,
                    file: ctx.line.file.getRoot().scope,
                    section: state.inSections[0],
                    byteOffset: state.sections[state.inSections[0]].bytes.length,
                    exported: exported || ctx.options.exportAllLabels
                }
            },
            inLabel: local ? state.inLabel : labelId
        }
    }

    public applySourceReplace(source: string, regex: RegExp, value: string): string {
        let matches = regex.exec(source)
        while (matches !== null) {
            const dstIndex = matches.index
            const dstLength = value.length
            const srcLength = matches[0].length

            source = source.substring(0, dstIndex) + value + source.substring(dstIndex + srcLength)

            regex.lastIndex = dstIndex + dstLength
            matches = regex.exec(source)
        }
        return source
    }

    public error(msg: string, token: Token | undefined, ctx: EvaluatorContext): void {
        ctx.line.file.context.diagnostics.push(new Diagnostic('Evaluator', msg, 'error', token, ctx.line))
    }

    public warn(msg: string, token: Token | undefined, ctx: EvaluatorContext): void {
        ctx.line.file.context.diagnostics.push(new Diagnostic('Evaluator', msg, 'warn', token, ctx.line))
    }

    public info(msg: string, token: Token | undefined, ctx: EvaluatorContext): void {
        ctx.line.file.context.diagnostics.push(new Diagnostic('Evaluator', msg, 'info', token, ctx.line))
    }
}
