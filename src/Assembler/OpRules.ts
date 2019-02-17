import IOpVariant from './IOpVariant'

const OpRules: { [key: string]: IOpVariant[] } = {
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
            args: ['[c]', 'a'],
            opcode: 0xE2
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
            args: ['a', '[c]'],
            opcode: 0xF2
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
            args: ['[n8]', 'a'],
            opcode: 0xE0
        },
        {
            args: ['a', '[n8]'],
            opcode: 0xF0
        }
    ],
    ldio: [
        {
            args: ['[c]', 'a'],
            opcode: 0xE2
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
            args: ['a', '[c]'],
            opcode: 0xF2
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

export default OpRules
