import IOpVariant from './IOpVariant'

const OpRules: { [key: string]: IOpVariant[] } = {
    adc: [
        {
            args: ['a'],
            opcode: 0x8F,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + a + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['b'],
            opcode: 0x88,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + b + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['c'],
            opcode: 0x89,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + c + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['d'],
            opcode: 0x8A,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + d + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['e'],
            opcode: 0x8B,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + e + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['h'],
            opcode: 0x8C,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + h + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['l'],
            opcode: 0x8D,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + l + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0x8E,
            bytes: 1,
            cycles: 2,
            desc: 'a = a + [hl] + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['n8'],
            opcode: 0xCE,
            bytes: 2,
            cycles: 2,
            desc: 'a = a + n8 + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', 'a'],
            opcode: 0x8F,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + a + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', 'b'],
            opcode: 0x88,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + b + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', 'c'],
            opcode: 0x89,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + c + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', 'd'],
            opcode: 0x8A,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + d + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', 'e'],
            opcode: 0x8B,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + e + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', 'h'],
            opcode: 0x8C,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + h + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', 'l'],
            opcode: 0x8D,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + l + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', '[hl]'],
            opcode: 0x8E,
            bytes: 1,
            cycles: 2,
            desc: 'a = a + [hl] + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', 'n8'],
            opcode: 0xCE,
            bytes: 2,
            cycles: 2,
            desc: 'a = a + n8 + carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        }
    ],
    add: [
        {
            args: ['a'],
            opcode: 0x87,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + a',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['b'],
            opcode: 0x80,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + b',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['c'],
            opcode: 0x81,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + c',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['d'],
            opcode: 0x82,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + d',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['e'],
            opcode: 0x83,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + e',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['h'],
            opcode: 0x84,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + h',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['l'],
            opcode: 0x85,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + l',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0x86,
            bytes: 1,
            cycles: 2,
            desc: 'a = a + [hl]',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['n8'],
            opcode: 0xC6,
            bytes: 2,
            cycles: 2,
            desc: 'a = a + n8',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', 'a'],
            opcode: 0x87,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + a',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', 'b'],
            opcode: 0x80,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + b',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', 'c'],
            opcode: 0x81,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + c',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', 'd'],
            opcode: 0x82,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + d',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', 'e'],
            opcode: 0x83,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + e',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', 'h'],
            opcode: 0x84,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + h',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', 'l'],
            opcode: 0x85,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + l',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', '[hl]'],
            opcode: 0x86,
            bytes: 1,
            cycles: 2,
            desc: 'a = a + [hl]',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['a', 'n8'],
            opcode: 0xC6,
            bytes: 2,
            cycles: 2,
            desc: 'a = a + n8',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        },
        {
            args: ['hl', 'bc'],
            opcode: 0x09,
            bytes: 1,
            cycles: 2,
            desc: 'hl = hl + bc',
            flags: {
                n: '0',
                h: 'Set if overflow from bit 11',
                c: 'Set if overflow from bit 15'
            }
        },
        {
            args: ['hl', 'de'],
            opcode: 0x19,
            bytes: 1,
            cycles: 2,
            desc: 'hl = hl + de',
            flags: {
                n: '0',
                h: 'Set if overflow from bit 11',
                c: 'Set if overflow from bit 15'
            }
        },
        {
            args: ['hl', 'hl'],
            opcode: 0x29,
            bytes: 1,
            cycles: 2,
            desc: 'hl = hl + hl',
            flags: {
                n: '0',
                h: 'Set if overflow from bit 11',
                c: 'Set if overflow from bit 15'
            }
        },
        {
            args: ['hl', 'sp'],
            opcode: 0x39,
            bytes: 1,
            cycles: 2,
            desc: 'hl = hl + sp',
            flags: {
                n: '0',
                h: 'Set if overflow from bit 11',
                c: 'Set if overflow from bit 15'
            }
        },
        {
            args: ['sp', 'e8'],
            opcode: 0xE8,
            bytes: 2,
            cycles: 4,
            desc: 'sp = sp + e8 (signed)',
            flags: {
                z: '0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        }
    ],
    and: [
        {
            args: ['a'],
            opcode: 0xA7,
            bytes: 1,
            cycles: 1,
            desc: 'a = a & a',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        },
        {
            args: ['b'],
            opcode: 0xA0,
            bytes: 1,
            cycles: 1,
            desc: 'a = a & b',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        },
        {
            args: ['c'],
            opcode: 0xA1,
            bytes: 1,
            cycles: 1,
            desc: 'a = a & c',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        },
        {
            args: ['d'],
            opcode: 0xA2,
            bytes: 1,
            cycles: 1,
            desc: 'a = a & d',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        },
        {
            args: ['e'],
            opcode: 0xA3,
            bytes: 1,
            cycles: 1,
            desc: 'a = a & e',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        },
        {
            args: ['h'],
            opcode: 0xA4,
            bytes: 1,
            cycles: 1,
            desc: 'a = a & h',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        },
        {
            args: ['l'],
            opcode: 0xA5,
            bytes: 1,
            cycles: 1,
            desc: 'a = a & l',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0xA6,
            bytes: 1,
            cycles: 2,
            desc: 'a = a & [hl]',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        },
        {
            args: ['n8'],
            opcode: 0xE6,
            bytes: 2,
            cycles: 2,
            desc: 'a = a & n8',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        },
        {
            args: ['a', 'a'],
            opcode: 0xA7,
            bytes: 1,
            cycles: 1,
            desc: 'a = a & a',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        },
        {
            args: ['a', 'b'],
            opcode: 0xA0,
            bytes: 1,
            cycles: 1,
            desc: 'a = a & b',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        },
        {
            args: ['a', 'c'],
            opcode: 0xA1,
            bytes: 1,
            cycles: 1,
            desc: 'a = a & c',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        },
        {
            args: ['a', 'd'],
            opcode: 0xA2,
            bytes: 1,
            cycles: 1,
            desc: 'a = a & d',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        },
        {
            args: ['a', 'e'],
            opcode: 0xA3,
            bytes: 1,
            cycles: 1,
            desc: 'a = a & e',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        },
        {
            args: ['a', 'h'],
            opcode: 0xA4,
            bytes: 1,
            cycles: 1,
            desc: 'a = a & h',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        },
        {
            args: ['a', 'l'],
            opcode: 0xA5,
            bytes: 1,
            cycles: 1,
            desc: 'a = a & l',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        },
        {
            args: ['a', '[hl]'],
            opcode: 0xA6,
            bytes: 1,
            cycles: 2,
            desc: 'a = a & [hl]',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        },
        {
            args: ['a', 'n8'],
            opcode: 0xE6,
            bytes: 2,
            cycles: 2,
            desc: 'a = a & n8',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '1',
                c: '0'
            }
        }
    ],
    cp: [
        {
            args: ['a'],
            opcode: 0xBF,
            bytes: 1,
            cycles: 1,
            desc: 'a - a (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == a)',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > a)'
            }
        },
        {
            args: ['b'],
            opcode: 0xB8,
            bytes: 1,
            cycles: 1,
            desc: 'a - b (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == b)',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > b)'
            }
        },
        {
            args: ['c'],
            opcode: 0xB9,
            bytes: 1,
            cycles: 1,
            desc: 'a - c (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == c)',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > c)'
            }
        },
        {
            args: ['d'],
            opcode: 0xBA,
            bytes: 1,
            cycles: 1,
            desc: 'a - d (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == d)',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > d)'
            }
        },
        {
            args: ['e'],
            opcode: 0xBB,
            bytes: 1,
            cycles: 1,
            desc: 'a - e (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == e)',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > e)'
            }
        },
        {
            args: ['h'],
            opcode: 0xBC,
            bytes: 1,
            cycles: 1,
            desc: 'a - h (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == h)',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > h)'
            }
        },
        {
            args: ['l'],
            opcode: 0xBD,
            bytes: 1,
            cycles: 1,
            desc: 'a - l (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == l)',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > l)'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0xBE,
            bytes: 1,
            cycles: 2,
            desc: 'a - [hl] (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == [hl])',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > [hl])'
            }
        },
        {
            args: ['n8'],
            opcode: 0xFE,
            bytes: 2,
            cycles: 2,
            desc: 'a - n8 (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == n8)',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > n8)'
            }
        },
        {
            args: ['a', 'a'],
            opcode: 0xBF,
            bytes: 1,
            cycles: 1,
            desc: 'a - a (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == a)',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > a)'
            }
        },
        {
            args: ['a', 'b'],
            opcode: 0xB8,
            bytes: 1,
            cycles: 1,
            desc: 'a - b (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == b)',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > b)'
            }
        },
        {
            args: ['a', 'c'],
            opcode: 0xB9,
            bytes: 1,
            cycles: 1,
            desc: 'a - c (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == c)',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > c)'
            }
        },
        {
            args: ['a', 'd'],
            opcode: 0xBA,
            bytes: 1,
            cycles: 1,
            desc: 'a - d (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == d)',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > d)'
            }
        },
        {
            args: ['a', 'e'],
            opcode: 0xBB,
            bytes: 1,
            cycles: 1,
            desc: 'a - e (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == e)',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > e)'
            }
        },
        {
            args: ['a', 'h'],
            opcode: 0xBC,
            bytes: 1,
            cycles: 1,
            desc: 'a - h (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == h)',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > h)'
            }
        },
        {
            args: ['a', 'l'],
            opcode: 0xBD,
            bytes: 1,
            cycles: 1,
            desc: 'a - l (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == l)',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > l)'
            }
        },
        {
            args: ['a', '[hl]'],
            opcode: 0xBE,
            bytes: 1,
            cycles: 2,
            desc: 'a - [hl] (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == [hl])',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > [hl])'
            }
        },
        {
            args: ['a', 'n8'],
            opcode: 0xFE,
            bytes: 2,
            cycles: 2,
            desc: 'a - n8 (result not stored)',
            flags: {
                z: 'Set if result is 0 (a == n8)',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow (a > n8)'
            }
        }
    ],
    dec: [
        {
            args: ['a'],
            opcode: 0x3D,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - 1',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4'
            }
        },
        {
            args: ['b'],
            opcode: 0x05,
            bytes: 1,
            cycles: 1,
            desc: 'b = b - 1',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4'
            }
        },
        {
            args: ['c'],
            opcode: 0x0D,
            bytes: 1,
            cycles: 1,
            desc: 'c = c - 1',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4'
            }
        },
        {
            args: ['d'],
            opcode: 0x15,
            bytes: 1,
            cycles: 1,
            desc: 'd = d - 1',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4'
            }
        },
        {
            args: ['e'],
            opcode: 0x1D,
            bytes: 1,
            cycles: 1,
            desc: 'e = e - 1',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4'
            }
        },
        {
            args: ['h'],
            opcode: 0x25,
            bytes: 1,
            cycles: 1,
            desc: 'h = h - 1',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4'
            }
        },
        {
            args: ['l'],
            opcode: 0x2D,
            bytes: 1,
            cycles: 1,
            desc: 'l = l - 1',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0x35,
            bytes: 1,
            cycles: 3,
            desc: '[hl] = [hl] - 1',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4'
            }
        },
        {
            args: ['bc'],
            opcode: 0x0B,
            bytes: 1,
            cycles: 2,
            desc: 'bc = bc - 1'
        },
        {
            args: ['de'],
            opcode: 0x1B,
            bytes: 1,
            cycles: 2,
            desc: 'de = de - 1'
        },
        {
            args: ['hl'],
            opcode: 0x2B,
            bytes: 1,
            cycles: 2,
            desc: 'hl = hl - 1'
        },
        {
            args: ['sp'],
            opcode: 0x3B,
            bytes: 1,
            cycles: 2,
            desc: 'sp = sp - 1'
        }
    ],
    inc: [
        {
            args: ['a'],
            opcode: 0x3C,
            bytes: 1,
            cycles: 1,
            desc: 'a = a + 1',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3'
            }
        },
        {
            args: ['b'],
            opcode: 0x04,
            bytes: 1,
            cycles: 1,
            desc: 'b = b + 1',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3'
            }
        },
        {
            args: ['c'],
            opcode: 0x0C,
            bytes: 1,
            cycles: 1,
            desc: 'c = c + 1',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3'
            }
        },
        {
            args: ['d'],
            opcode: 0x14,
            bytes: 1,
            cycles: 1,
            desc: 'd = d + 1',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3'
            }
        },
        {
            args: ['e'],
            opcode: 0x1C,
            bytes: 1,
            cycles: 1,
            desc: 'e = e + 1',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3'
            }
        },
        {
            args: ['h'],
            opcode: 0x24,
            bytes: 1,
            cycles: 1,
            desc: 'h = h + 1',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3'
            }
        },
        {
            args: ['l'],
            opcode: 0x2C,
            bytes: 1,
            cycles: 1,
            desc: 'l = l + 1',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0x34,
            bytes: 1,
            cycles: 3,
            desc: '[hl] = [hl] + 1',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: 'Set if overflow from bit 3'
            }
        },
        {
            args: ['bc'],
            opcode: 0x03,
            bytes: 1,
            cycles: 2,
            desc: 'bc = bc + 1'
        },
        {
            args: ['de'],
            opcode: 0x13,
            bytes: 1,
            cycles: 2,
            desc: 'de = de + 1'
        },
        {
            args: ['hl'],
            opcode: 0x23,
            bytes: 1,
            cycles: 2,
            desc: 'hl = hl + 1'
        },
        {
            args: ['sp'],
            opcode: 0x33,
            bytes: 1,
            cycles: 2,
            desc: 'sp = sp + 1'
        }
    ],
    or: [
        {
            args: ['a'],
            opcode: 0xB7,
            bytes: 1,
            cycles: 1,
            desc: 'a = a | a',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['b'],
            opcode: 0xB0,
            bytes: 1,
            cycles: 1,
            desc: 'a = a | b',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['c'],
            opcode: 0xB1,
            bytes: 1,
            cycles: 1,
            desc: 'a = a | c',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['d'],
            opcode: 0xB2,
            bytes: 1,
            cycles: 1,
            desc: 'a = a | d',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['e'],
            opcode: 0xB3,
            bytes: 1,
            cycles: 1,
            desc: 'a = a | e',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['h'],
            opcode: 0xB4,
            bytes: 1,
            cycles: 1,
            desc: 'a = a | h',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['l'],
            opcode: 0xB5,
            bytes: 1,
            cycles: 1,
            desc: 'a = a | l',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0xB6,
            bytes: 1,
            cycles: 2,
            desc: 'a = a | [hl]',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['n8'],
            opcode: 0xF6,
            bytes: 2,
            cycles: 2,
            desc: 'a = a | n8',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', 'a'],
            opcode: 0xB7,
            bytes: 1,
            cycles: 1,
            desc: 'a = a | a',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', 'b'],
            opcode: 0xB0,
            bytes: 1,
            cycles: 1,
            desc: 'a = a | b',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', 'c'],
            opcode: 0xB1,
            bytes: 1,
            cycles: 1,
            desc: 'a = a | c',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', 'd'],
            opcode: 0xB2,
            bytes: 1,
            cycles: 1,
            desc: 'a = a | d',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', 'e'],
            opcode: 0xB3,
            bytes: 1,
            cycles: 1,
            desc: 'a = a | e',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', 'h'],
            opcode: 0xB4,
            bytes: 1,
            cycles: 1,
            desc: 'a = a | h',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', 'l'],
            opcode: 0xB5,
            bytes: 1,
            cycles: 1,
            desc: 'a = a | l',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', '[hl]'],
            opcode: 0xB6,
            bytes: 1,
            cycles: 2,
            desc: 'a = a | [hl]',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', 'n8'],
            opcode: 0xF6,
            bytes: 2,
            cycles: 2,
            desc: 'a = a | n8',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        }
    ],
    sbc: [
        {
            args: ['a'],
            opcode: 0x9F,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - a - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['b'],
            opcode: 0x98,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - b - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['c'],
            opcode: 0x99,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - c - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['d'],
            opcode: 0x9A,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - d - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['e'],
            opcode: 0x9B,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - e - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['h'],
            opcode: 0x9C,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - h - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['l'],
            opcode: 0x9D,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - l - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0x9E,
            bytes: 1,
            cycles: 2,
            desc: 'a = a - [hl] - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['n8'],
            opcode: 0xDE,
            bytes: 2,
            cycles: 2,
            desc: 'a = a - n8 - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', 'a'],
            opcode: 0x9F,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - a - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', 'b'],
            opcode: 0x98,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - b - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', 'c'],
            opcode: 0x99,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - c - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', 'd'],
            opcode: 0x9A,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - d - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', 'e'],
            opcode: 0x9B,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - e - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', 'h'],
            opcode: 0x9C,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - h - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', 'l'],
            opcode: 0x9D,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - l - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', '[hl]'],
            opcode: 0x9E,
            bytes: 1,
            cycles: 2,
            desc: 'a = a - [hl] - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', 'n8'],
            opcode: 0xDE,
            bytes: 2,
            cycles: 2,
            desc: 'a = a - n8 - carry',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        }
    ],
    sub: [
        {
            args: ['a'],
            opcode: 0x97,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - a',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['b'],
            opcode: 0x90,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - b',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['c'],
            opcode: 0x91,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - c',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['d'],
            opcode: 0x92,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - d',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['e'],
            opcode: 0x93,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - e',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['h'],
            opcode: 0x94,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - h',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['l'],
            opcode: 0x95,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - l',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0x96,
            bytes: 1,
            cycles: 2,
            desc: 'a = a - [hl]',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['n8'],
            opcode: 0xD6,
            bytes: 2,
            cycles: 2,
            desc: 'a = a - n8',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', 'a'],
            opcode: 0x97,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - a',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', 'b'],
            opcode: 0x90,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - b',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', 'c'],
            opcode: 0x91,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - c',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', 'd'],
            opcode: 0x92,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - d',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', 'e'],
            opcode: 0x93,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - e',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', 'h'],
            opcode: 0x94,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - h',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', 'l'],
            opcode: 0x95,
            bytes: 1,
            cycles: 1,
            desc: 'a = a - l',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', '[hl]'],
            opcode: 0x96,
            bytes: 1,
            cycles: 2,
            desc: 'a = a - [hl]',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        },
        {
            args: ['a', 'n8'],
            opcode: 0xD6,
            bytes: 2,
            cycles: 2,
            desc: 'a = a - n8',
            flags: {
                z: 'Set if result is 0',
                n: '1',
                h: 'Set if no borrow from bit 4',
                c: 'Set if no borrow'
            }
        }
    ],
    xor: [
        {
            args: ['a'],
            opcode: 0xAF,
            bytes: 1,
            cycles: 1,
            desc: 'a = a ^ a',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['b'],
            opcode: 0xA8,
            bytes: 1,
            cycles: 1,
            desc: 'a = a ^ b',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['c'],
            opcode: 0xA9,
            bytes: 1,
            cycles: 1,
            desc: 'a = a ^ c',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['d'],
            opcode: 0xAA,
            bytes: 1,
            cycles: 1,
            desc: 'a = a ^ d',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['e'],
            opcode: 0xAB,
            bytes: 1,
            cycles: 1,
            desc: 'a = a ^ e',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['h'],
            opcode: 0xAC,
            bytes: 1,
            cycles: 1,
            desc: 'a = a ^ h',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['l'],
            opcode: 0xAD,
            bytes: 1,
            cycles: 1,
            desc: 'a = a ^ l',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0xAE,
            bytes: 1,
            cycles: 2,
            desc: 'a = a ^ [hl]',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['n8'],
            opcode: 0xEE,
            bytes: 2,
            cycles: 2,
            desc: 'a = a ^ n8',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', 'a'],
            opcode: 0xAF,
            bytes: 1,
            cycles: 1,
            desc: 'a = a ^ a',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', 'b'],
            opcode: 0xA8,
            bytes: 1,
            cycles: 1,
            desc: 'a = a ^ b',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', 'c'],
            opcode: 0xA9,
            bytes: 1,
            cycles: 1,
            desc: 'a = a ^ c',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', 'd'],
            opcode: 0xAA,
            bytes: 1,
            cycles: 1,
            desc: 'a = a ^ d',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', 'e'],
            opcode: 0xAB,
            bytes: 1,
            cycles: 1,
            desc: 'a = a ^ e',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', 'h'],
            opcode: 0xAC,
            bytes: 1,
            cycles: 1,
            desc: 'a = a ^ h',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', 'l'],
            opcode: 0xAD,
            bytes: 1,
            cycles: 1,
            desc: 'a = a ^ l',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', '[hl]'],
            opcode: 0xAE,
            bytes: 1,
            cycles: 2,
            desc: 'a = a ^ [hl]',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['a', 'n8'],
            opcode: 0xEE,
            bytes: 2,
            cycles: 2,
            desc: 'a = a ^ n8',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        }
    ],
    bit: [
        {
            args: ['u3', 'a'],
            opcode: 0x47,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Tests bit u3 in a',
            flags: {
                z: 'Set if selected bit is 0',
                n: '0',
                h: '0'
            }
        },
        {
            args: ['u3', 'b'],
            opcode: 0x40,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Tests bit u3 in b',
            flags: {
                z: 'Set if selected bit is 0',
                n: '0',
                h: '0'
            }
        },
        {
            args: ['u3', 'c'],
            opcode: 0x41,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Tests bit u3 in c',
            flags: {
                z: 'Set if selected bit is 0',
                n: '0',
                h: '0'
            }
        },
        {
            args: ['u3', 'd'],
            opcode: 0x42,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Tests bit u3 in d',
            flags: {
                z: 'Set if selected bit is 0',
                n: '0',
                h: '0'
            }
        },
        {
            args: ['u3', 'e'],
            opcode: 0x43,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Tests bit u3 in e',
            flags: {
                z: 'Set if selected bit is 0',
                n: '0',
                h: '0'
            }
        },
        {
            args: ['u3', 'h'],
            opcode: 0x44,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Tests bit u3 in h',
            flags: {
                z: 'Set if selected bit is 0',
                n: '0',
                h: '0'
            }
        },
        {
            args: ['u3', 'l'],
            opcode: 0x45,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Tests bit u3 in l',
            flags: {
                z: 'Set if selected bit is 0',
                n: '0',
                h: '0'
            }
        },
        {
            args: ['u3', '[hl]'],
            opcode: 0x46,
            prefix: 0xCB,
            bytes: 2,
            cycles: 3,
            desc: 'Tests bit u3 in [hl]',
            flags: {
                z: 'Set if selected bit is 0',
                n: '0',
                h: '0'
            }
        }
    ],
    res: [
        {
            args: ['u3', 'a'],
            opcode: 0x87,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Set bit u3 in a to 0'
        },
        {
            args: ['u3', 'b'],
            opcode: 0x80,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Set bit u3 in b to 0'
        },
        {
            args: ['u3', 'c'],
            opcode: 0x81,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Set bit u3 in c to 0'
        },
        {
            args: ['u3', 'd'],
            opcode: 0x82,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Set bit u3 in d to 0'
        },
        {
            args: ['u3', 'e'],
            opcode: 0x83,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Set bit u3 in e to 0'
        },
        {
            args: ['u3', 'h'],
            opcode: 0x84,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Set bit u3 in h to 0'
        },
        {
            args: ['u3', 'l'],
            opcode: 0x85,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Set bit u3 in l to 0'
        },
        {
            args: ['u3', '[hl]'],
            opcode: 0x86,
            prefix: 0xCB,
            bytes: 2,
            cycles: 4,
            desc: 'Set bit u3 in [hl] to 0'
        }
    ],
    set: [
        {
            args: ['u3', 'a'],
            opcode: 0xC7,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Set bit u3 in a to 1'
        },
        {
            args: ['u3', 'b'],
            opcode: 0xC0,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Set bit u3 in b to 1'
        },
        {
            args: ['u3', 'c'],
            opcode: 0xC1,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Set bit u3 in c to 1'
        },
        {
            args: ['u3', 'd'],
            opcode: 0xC2,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Set bit u3 in d to 1'
        },
        {
            args: ['u3', 'e'],
            opcode: 0xC3,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Set bit u3 in e to 1'
        },
        {
            args: ['u3', 'h'],
            opcode: 0xC4,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Set bit u3 in h to 1'
        },
        {
            args: ['u3', 'l'],
            opcode: 0xC5,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Set bit u3 in l to 1'
        },
        {
            args: ['u3', '[hl]'],
            opcode: 0xC6,
            prefix: 0xCB,
            bytes: 2,
            cycles: 4,
            desc: 'Set bit u3 in [hl] to 1'
        }
    ],
    swap: [
        {
            args: ['a'],
            opcode: 0x37,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Swap upper and lower nybbles of a',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['b'],
            opcode: 0x30,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Swap upper and lower nybbles of b',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['c'],
            opcode: 0x31,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Swap upper and lower nybbles of c',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['d'],
            opcode: 0x32,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Swap upper and lower nybbles of d',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['e'],
            opcode: 0x33,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Swap upper and lower nybbles of e',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['h'],
            opcode: 0x34,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Swap upper and lower nybbles of h',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['l'],
            opcode: 0x35,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Swap upper and lower nybbles of l',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0x36,
            prefix: 0xCB,
            bytes: 2,
            cycles: 4,
            desc: 'Swap upper and lower nybbles of [hl]',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: '0'
            }
        }
    ],
    rl: [
        {
            args: ['a'],
            opcode: 0x17,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate a left through carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['b'],
            opcode: 0x10,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate b left through carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['c'],
            opcode: 0x11,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate c left through carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['d'],
            opcode: 0x12,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate d left through carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['e'],
            opcode: 0x13,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate e left through carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['h'],
            opcode: 0x14,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate h left through carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['l'],
            opcode: 0x15,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate l left through carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0x16,
            prefix: 0xCB,
            bytes: 2,
            cycles: 4,
            desc: 'Rotate [hl] left through carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        }
    ],
    rla: [
        {
            args: [],
            opcode: 0x17,
            bytes: 1,
            cycles: 1,
            desc: 'Rotate a left through carry',
            flags: {
                z: '0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        }
    ],
    rlc: [
        {
            args: ['a'],
            opcode: 0x07,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate a left',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['b'],
            opcode: 0x00,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate b left',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['c'],
            opcode: 0x01,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate c left',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['d'],
            opcode: 0x02,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate d left',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['e'],
            opcode: 0x03,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate e left',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['h'],
            opcode: 0x04,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate h left',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['l'],
            opcode: 0x05,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate l left',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0x06,
            prefix: 0xCB,
            bytes: 2,
            cycles: 4,
            desc: 'Rotate [hl] left',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        }
    ],
    rlca: [
        {
            args: [],
            opcode: 0x07,
            bytes: 1,
            cycles: 1,
            desc: 'Rotate a left',
            flags: {
                z: '0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        }
    ],
    rr: [
        {
            args: ['a'],
            opcode: 0x1F,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate a right through carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['b'],
            opcode: 0x18,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate b right through carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['c'],
            opcode: 0x19,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate c right through carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['d'],
            opcode: 0x1A,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate d right through carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['e'],
            opcode: 0x1B,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate e right through carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['h'],
            opcode: 0x1C,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate h right through carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['l'],
            opcode: 0x1D,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate l right through carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0x1E,
            prefix: 0xCB,
            bytes: 2,
            cycles: 4,
            desc: 'Rotate [hl] right through carry',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        }
    ],
    rra: [
        {
            args: [],
            opcode: 0x1F,
            bytes: 1,
            cycles: 1,
            desc: 'Rotate a right through carry',
            flags: {
                z: '0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        }
    ],
    rrc: [
        {
            args: ['a'],
            opcode: 0x0F,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate a right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['b'],
            opcode: 0x08,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate b right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['c'],
            opcode: 0x09,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate c right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['d'],
            opcode: 0x0A,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate d right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['e'],
            opcode: 0x0B,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate e right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['h'],
            opcode: 0x0C,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate h right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['l'],
            opcode: 0x0D,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Rotate l right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0x0E,
            prefix: 0xCB,
            bytes: 2,
            cycles: 4,
            desc: 'Rotate [hl] right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        }
    ],
    rrca: [
        {
            args: [],
            opcode: 0x0F,
            bytes: 1,
            cycles: 1,
            desc: 'Rotate a right',
            flags: {
                z: '0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        }
    ],
    sla: [
        {
            args: ['a'],
            opcode: 0x27,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Arithmetic shift a left',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['b'],
            opcode: 0x20,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Arithmetic shift b left',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['c'],
            opcode: 0x21,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Arithmetic shift c left',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['d'],
            opcode: 0x22,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Arithmetic shift d left',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['e'],
            opcode: 0x23,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Arithmetic shift e left',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['h'],
            opcode: 0x24,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Arithmetic shift h left',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['l'],
            opcode: 0x25,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Arithmetic shift l left',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0x26,
            prefix: 0xCB,
            bytes: 2,
            cycles: 4,
            desc: 'Arithmetic shift [hl] left',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 7'
            }
        }
    ],
    sra: [
        {
            args: ['a'],
            opcode: 0x2F,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Arithmetic shift a right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['b'],
            opcode: 0x28,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Arithmetic shift b right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['c'],
            opcode: 0x29,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Arithmetic shift c right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['d'],
            opcode: 0x2A,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Arithmetic shift d right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['e'],
            opcode: 0x2B,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Arithmetic shift e right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['h'],
            opcode: 0x2C,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Arithmetic shift h right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['l'],
            opcode: 0x2D,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Arithmetic shift l right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0x2E,
            prefix: 0xCB,
            bytes: 2,
            cycles: 4,
            desc: 'Arithmetic shift [hl] right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        }
    ],
    srl: [
        {
            args: ['a'],
            opcode: 0x3F,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Logical shift a right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['b'],
            opcode: 0x38,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Logical shift b right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['c'],
            opcode: 0x39,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Logical shift c right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['d'],
            opcode: 0x3A,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Logical shift d right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['e'],
            opcode: 0x3B,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Logical shift e right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['h'],
            opcode: 0x3C,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Logical shift h right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['l'],
            opcode: 0x3D,
            prefix: 0xCB,
            bytes: 2,
            cycles: 2,
            desc: 'Logical shift l right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        },
        {
            args: ['[hl]'],
            opcode: 0x3E,
            prefix: 0xCB,
            bytes: 2,
            cycles: 4,
            desc: 'Logical shift [hl] right',
            flags: {
                z: 'Set if result is 0',
                n: '0',
                h: '0',
                c: 'Set to initial bit 0'
            }
        }
    ],
    ld: [
        {
            args: ['a', 'a'],
            opcode: 0x7F,
            bytes: 1,
            cycles: 1,
            desc: 'a = a'
        },
        {
            args: ['a', 'b'],
            opcode: 0x78,
            bytes: 1,
            cycles: 1,
            desc: 'a = b'
        },
        {
            args: ['a', 'c'],
            opcode: 0x79,
            bytes: 1,
            cycles: 1,
            desc: 'a = c'
        },
        {
            args: ['a', 'd'],
            opcode: 0x7A,
            bytes: 1,
            cycles: 1,
            desc: 'a = d'
        },
        {
            args: ['a', 'e'],
            opcode: 0x7B,
            bytes: 1,
            cycles: 1,
            desc: 'a = e'
        },
        {
            args: ['a', 'h'],
            opcode: 0x7C,
            bytes: 1,
            cycles: 1,
            desc: 'a = h'
        },
        {
            args: ['a', 'l'],
            opcode: 0x7D,
            bytes: 1,
            cycles: 1,
            desc: 'a = l'
        },
        {
            args: ['a', '[c]'],
            opcode: 0xF2,
            bytes: 1,
            cycles: 2,
            desc: 'a = [$FF00 + c]'
        },
        {
            args: ['a', '[bc]'],
            opcode: 0x0A,
            bytes: 1,
            cycles: 2,
            desc: 'a = [bc]'
        },
        {
            args: ['a', '[de]'],
            opcode: 0x1A,
            bytes: 1,
            cycles: 2,
            desc: 'a = [de]'
        },
        {
            args: ['a', '[hl]'],
            opcode: 0x7E,
            bytes: 1,
            cycles: 2,
            desc: 'a = [hl]'
        },
        {
            args: ['a', '[hl+]'],
            opcode: 0x2A,
            bytes: 1,
            cycles: 2,
            desc: 'a = [hl], hl = hl + 1'
        },
        {
            args: ['a', '[hli]'],
            opcode: 0x2A,
            bytes: 1,
            cycles: 2,
            desc: 'a = [hl], hl = hl + 1'
        },
        {
            args: ['a', '[hl-]'],
            opcode: 0x3A,
            bytes: 1,
            cycles: 2,
            desc: 'a = [hl], hl = hl - 1'
        },
        {
            args: ['a', '[hld]'],
            opcode: 0x3A,
            bytes: 1,
            cycles: 2,
            desc: 'a = [hl], hl = hl - 1'
        },
        {
            args: ['a', '[$FF00+c]'],
            opcode: 0xF2,
            bytes: 1,
            cycles: 2,
            desc: 'a = [$FF00 + c]'
        },
        {
            args: ['a', '[$FF00+n8]'],
            opcode: 0xF0,
            bytes: 2,
            cycles: 3,
            desc: 'a = [$FF00 + n8]'
        },
        {
            args: ['a', '[n16]'],
            opcode: 0xFA,
            bytes: 3,
            cycles: 4,
            desc: 'a = [n16]'
        },
        {
            args: ['a', 'n8'],
            opcode: 0x3E,
            bytes: 2,
            cycles: 2,
            desc: 'a = n8'
        },
        {
            args: ['b', 'a'],
            opcode: 0x47,
            bytes: 1,
            cycles: 1,
            desc: 'b = a'
        },
        {
            args: ['b', 'b'],
            opcode: 0x40,
            bytes: 1,
            cycles: 1,
            desc: 'b = b (emulator breakpoint)'
        },
        {
            args: ['b', 'c'],
            opcode: 0x41,
            bytes: 1,
            cycles: 1,
            desc: 'b = c'
        },
        {
            args: ['b', 'd'],
            opcode: 0x42,
            bytes: 1,
            cycles: 1,
            desc: 'b = d'
        },
        {
            args: ['b', 'e'],
            opcode: 0x43,
            bytes: 1,
            cycles: 1,
            desc: 'b = e'
        },
        {
            args: ['b', 'h'],
            opcode: 0x44,
            bytes: 1,
            cycles: 1,
            desc: 'b = h'
        },
        {
            args: ['b', 'l'],
            opcode: 0x45,
            bytes: 1,
            cycles: 1,
            desc: 'b = l'
        },
        {
            args: ['b', '[hl]'],
            opcode: 0x46,
            bytes: 1,
            cycles: 2,
            desc: 'a = [hl]'
        },
        {
            args: ['b', 'n8'],
            opcode: 0x06,
            bytes: 2,
            cycles: 2,
            desc: 'b = n8'
        },
        {
            args: ['c', 'a'],
            opcode: 0x4F,
            bytes: 1,
            cycles: 1,
            desc: 'c = a'
        },
        {
            args: ['c', 'b'],
            opcode: 0x48,
            bytes: 1,
            cycles: 1,
            desc: 'c = b'
        },
        {
            args: ['c', 'c'],
            opcode: 0x49,
            bytes: 1,
            cycles: 1,
            desc: 'c = c'
        },
        {
            args: ['c', 'd'],
            opcode: 0x4A,
            bytes: 1,
            cycles: 1,
            desc: 'c = d'
        },
        {
            args: ['c', 'e'],
            opcode: 0x4B,
            bytes: 1,
            cycles: 1,
            desc: 'c = e'
        },
        {
            args: ['c', 'h'],
            opcode: 0x4C,
            bytes: 1,
            cycles: 1,
            desc: 'c = h'
        },
        {
            args: ['c', 'l'],
            opcode: 0x4D,
            bytes: 1,
            cycles: 1,
            desc: 'c = l'
        },
        {
            args: ['c', '[hl]'],
            opcode: 0x4E,
            bytes: 1,
            cycles: 2,
            desc: 'c = [hl]'
        },
        {
            args: ['c', 'n8'],
            opcode: 0x0E,
            bytes: 2,
            cycles: 2,
            desc: 'c = n8'
        },
        {
            args: ['d', 'a'],
            opcode: 0x57,
            bytes: 1,
            cycles: 1,
            desc: 'd = a'
        },
        {
            args: ['d', 'b'],
            opcode: 0x50,
            bytes: 1,
            cycles: 1,
            desc: 'd = b'
        },
        {
            args: ['d', 'c'],
            opcode: 0x51,
            bytes: 1,
            cycles: 1,
            desc: 'd = c'
        },
        {
            args: ['d', 'd'],
            opcode: 0x52,
            bytes: 1,
            cycles: 1,
            desc: 'd = d (emulator debug message)'
        },
        {
            args: ['d', 'e'],
            opcode: 0x53,
            bytes: 1,
            cycles: 1,
            desc: 'd = e'
        },
        {
            args: ['d', 'h'],
            opcode: 0x54,
            bytes: 1,
            cycles: 1,
            desc: 'd = h'
        },
        {
            args: ['d', 'l'],
            opcode: 0x55,
            bytes: 1,
            cycles: 1,
            desc: 'd = l'
        },
        {
            args: ['d', '[hl]'],
            opcode: 0x56,
            bytes: 1,
            cycles: 2,
            desc: 'd = [hl]'
        },
        {
            args: ['d', 'n8'],
            opcode: 0x16,
            bytes: 2,
            cycles: 2,
            desc: 'd = n8'
        },
        {
            args: ['e', 'a'],
            opcode: 0x5F,
            bytes: 1,
            cycles: 1,
            desc: 'e = a'
        },
        {
            args: ['e', 'b'],
            opcode: 0x58,
            bytes: 1,
            cycles: 1,
            desc: 'e = b'
        },
        {
            args: ['e', 'c'],
            opcode: 0x59,
            bytes: 1,
            cycles: 1,
            desc: 'e = c'
        },
        {
            args: ['e', 'd'],
            opcode: 0x5A,
            bytes: 1,
            cycles: 1,
            desc: 'e = d'
        },
        {
            args: ['e', 'e'],
            opcode: 0x5B,
            bytes: 1,
            cycles: 1,
            desc: 'e = e'
        },
        {
            args: ['e', 'h'],
            opcode: 0x5C,
            bytes: 1,
            cycles: 1,
            desc: 'e = h'
        },
        {
            args: ['e', 'l'],
            opcode: 0x5D,
            bytes: 1,
            cycles: 1,
            desc: 'e = l'
        },
        {
            args: ['e', '[hl]'],
            opcode: 0x5E,
            bytes: 1,
            cycles: 2,
            desc: 'e = [hl]'
        },
        {
            args: ['e', 'n8'],
            opcode: 0x1E,
            bytes: 2,
            cycles: 2,
            desc: 'e = n8'
        },
        {
            args: ['h', 'a'],
            opcode: 0x67,
            bytes: 1,
            cycles: 1,
            desc: 'h = a'
        },
        {
            args: ['h', 'b'],
            opcode: 0x60,
            bytes: 1,
            cycles: 1,
            desc: 'h = b'
        },
        {
            args: ['h', 'c'],
            opcode: 0x61,
            bytes: 1,
            cycles: 1,
            desc: 'h = c'
        },
        {
            args: ['h', 'd'],
            opcode: 0x62,
            bytes: 1,
            cycles: 1,
            desc: 'h = d'
        },
        {
            args: ['h', 'e'],
            opcode: 0x63,
            bytes: 1,
            cycles: 1,
            desc: 'h = e'
        },
        {
            args: ['h', 'h'],
            opcode: 0x64,
            bytes: 1,
            cycles: 1,
            desc: 'h = h'
        },
        {
            args: ['h', 'l'],
            opcode: 0x65,
            bytes: 1,
            cycles: 1,
            desc: 'h = l'
        },
        {
            args: ['h', '[hl]'],
            opcode: 0x66,
            bytes: 1,
            cycles: 2,
            desc: 'h = [hl]'
        },
        {
            args: ['h', 'n8'],
            opcode: 0x26,
            bytes: 2,
            cycles: 2,
            desc: 'h = n8'
        },
        {
            args: ['l', 'a'],
            opcode: 0x6F,
            bytes: 1,
            cycles: 1,
            desc: 'l = a'
        },
        {
            args: ['l', 'b'],
            opcode: 0x68,
            bytes: 1,
            cycles: 1,
            desc: 'l = b'
        },
        {
            args: ['l', 'c'],
            opcode: 0x69,
            bytes: 1,
            cycles: 1,
            desc: 'l = c'
        },
        {
            args: ['l', 'd'],
            opcode: 0x6A,
            bytes: 1,
            cycles: 1,
            desc: 'l = d'
        },
        {
            args: ['l', 'e'],
            opcode: 0x6B,
            bytes: 1,
            cycles: 1,
            desc: 'l = e'
        },
        {
            args: ['l', 'h'],
            opcode: 0x6C,
            bytes: 1,
            cycles: 1,
            desc: 'l = h'
        },
        {
            args: ['l', 'l'],
            opcode: 0x6D,
            bytes: 1,
            cycles: 1,
            desc: 'l = l'
        },
        {
            args: ['l', '[hl]'],
            opcode: 0x6E,
            bytes: 1,
            cycles: 2,
            desc: 'l = [hl]'
        },
        {
            args: ['l', 'n8'],
            opcode: 0x2E,
            bytes: 2,
            cycles: 2,
            desc: 'l = n8'
        },
        {
            args: ['bc', 'n16'],
            opcode: 0x01,
            bytes: 3,
            cycles: 3,
            desc: 'bc = n16'
        },
        {
            args: ['de', 'n16'],
            opcode: 0x11,
            bytes: 3,
            cycles: 3,
            desc: 'bc = n16'
        },
        {
            args: ['hl', 'sp+e8'],
            opcode: 0xF8,
            bytes: 2,
            cycles: 3,
            desc: 'hl = sp + e8 (signed)',
            flags: {
                z: '0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if oberflow from bit 7'
            }
        },
        {
            args: ['hl', 'n16'],
            opcode: 0x21,
            bytes: 3,
            cycles: 3,
            desc: 'bc = n16'
        },
        {
            args: ['sp', 'hl'],
            opcode: 0xF9,
            bytes: 1,
            cycles: 2,
            desc: 'sp = hl'
        },
        {
            args: ['sp', 'n16'],
            opcode: 0x31,
            bytes: 3,
            cycles: 3,
            desc: 'sp = n16'
        },
        {
            args: ['[c]', 'a'],
            opcode: 0xE2,
            bytes: 1,
            cycles: 2,
            desc: '[$FF00 + c] = a'
        },
        {
            args: ['[bc]', 'a'],
            opcode: 0x02,
            bytes: 1,
            cycles: 2,
            desc: '[bc] = a'
        },
        {
            args: ['[de]', 'a'],
            opcode: 0x12,
            bytes: 1,
            cycles: 2,
            desc: '[de] = a'
        },
        {
            args: ['[hl]', 'a'],
            opcode: 0x77,
            bytes: 1,
            cycles: 2,
            desc: '[hl] = a'
        },
        {
            args: ['[hl]', 'b'],
            opcode: 0x70,
            bytes: 1,
            cycles: 2,
            desc: '[hl] = b'
        },
        {
            args: ['[hl]', 'c'],
            opcode: 0x71,
            bytes: 1,
            cycles: 2,
            desc: '[hl] = c'
        },
        {
            args: ['[hl]', 'd'],
            opcode: 0x72,
            bytes: 1,
            cycles: 2,
            desc: '[hl] = d'
        },
        {
            args: ['[hl]', 'e'],
            opcode: 0x73,
            bytes: 1,
            cycles: 2,
            desc: '[hl] = e'
        },
        {
            args: ['[hl]', 'h'],
            opcode: 0x74,
            bytes: 1,
            cycles: 2,
            desc: '[hl] = h'
        },
        {
            args: ['[hl]', 'l'],
            opcode: 0x75,
            bytes: 1,
            cycles: 2,
            desc: '[hl] = l'
        },
        {
            args: ['[hl]', 'n8'],
            opcode: 0x36,
            bytes: 2,
            cycles: 3,
            desc: '[hl] = n8'
        },
        {
            args: ['[hl+]', 'a'],
            opcode: 0x22,
            bytes: 1,
            cycles: 2,
            desc: '[hl] = a, hl = hl + 1'
        },
        {
            args: ['[hli]', 'a'],
            opcode: 0x22,
            bytes: 1,
            cycles: 2,
            desc: '[hl] = a, hl = hl + 1'
        },
        {
            args: ['[hl-]', 'a'],
            opcode: 0x32,
            bytes: 1,
            cycles: 2,
            desc: '[hl] = a, hl = hl - 1'
        },
        {
            args: ['[hld]', 'a'],
            opcode: 0x32,
            bytes: 1,
            cycles: 2,
            desc: '[hl] = a, hl = hl - 1'
        },
        {
            args: ['[$FF00+c]', 'a'],
            opcode: 0xE2,
            bytes: 1,
            cycles: 2,
            desc: '[$FF00 + c] = a'
        },
        {
            args: ['[$FF00+n8]', 'a'],
            opcode: 0xE0,
            bytes: 2,
            cycles: 3,
            desc: '[$FF00 + n8] = a'
        },
        {
            args: ['[n16]', 'a'],
            opcode: 0xEA,
            bytes: 3,
            cycles: 4,
            desc: '[n16] = a'
        },
        {
            args: ['[n16]', 'sp'],
            opcode: 0x08,
            bytes: 3,
            cycles: 5,
            desc: '[n16] = LOW(sp), [n16 + 1] = HIGH(sp)'
        }
    ],
    ldi: [
        {
            args: ['[hl]', 'a'],
            opcode: 0x22,
            bytes: 1,
            cycles: 2,
            desc: '[hl] = a, hl = hl + 1'
        },
        {
            args: ['a', '[hl]'],
            opcode: 0x2A,
            bytes: 1,
            cycles: 2,
            desc: 'a = [hl], hl = hl + 1'
        }
    ],
    ldd: [
        {
            args: ['[hl]', 'a'],
            opcode: 0x32,
            bytes: 1,
            cycles: 2,
            desc: '[hl] = a, hl = hl - 1'
        },
        {
            args: ['a', '[hl]'],
            opcode: 0x3A,
            bytes: 1,
            cycles: 2,
            desc: 'a = [hl], hl = hl - 1'
        }
    ],
    ldh: [
        {
            args: ['[c]', 'a'],
            opcode: 0xE2,
            bytes: 1,
            cycles: 2,
            desc: '[$FF00 + c] = a'
        },
        {
            args: ['[$FF00+c]', 'a'],
            opcode: 0xE2,
            bytes: 1,
            cycles: 2,
            desc: '[$FF00 + c] = a'
        },
        {
            args: ['[$FF00+n8]', 'a'],
            opcode: 0xE0,
            bytes: 2,
            cycles: 3,
            desc: '[$FF00 + n8] = a'
        },
        {
            args: ['a', '[c]'],
            opcode: 0xF2,
            bytes: 1,
            cycles: 2,
            desc: 'a = [$FF00 + c]'
        },
        {
            args: ['a', '[$FF00+c]'],
            opcode: 0xF2,
            bytes: 1,
            cycles: 2,
            desc: 'a = [$FF00 + c]'
        },
        {
            args: ['a', '[$FF00+n8]'],
            opcode: 0xF0,
            bytes: 2,
            cycles: 3,
            desc: 'a = [$FF00 + n8]'
        },
        {
            args: ['[n8]', 'a'],
            opcode: 0xE0,
            bytes: 2,
            cycles: 3,
            desc: '[$FF00 + n8] = a'
        },
        {
            args: ['a', '[n8]'],
            opcode: 0xF0,
            bytes: 2,
            cycles: 3,
            desc: 'a = [$FF00 + n8]'
        }
    ],
    ldio: [
        {
            args: ['[c]', 'a'],
            opcode: 0xE2,
            bytes: 1,
            cycles: 2,
            desc: '[$FF00 + c] = a'
        },
        {
            args: ['[$FF00+c]', 'a'],
            opcode: 0xE2,
            bytes: 1,
            cycles: 2,
            desc: '[$FF00 + c] = a'
        },
        {
            args: ['[$FF00+n8]', 'a'],
            opcode: 0xE0,
            bytes: 2,
            cycles: 3,
            desc: '[$FF00 + n8] = a'
        },
        {
            args: ['a', '[c]'],
            opcode: 0xF2,
            bytes: 1,
            cycles: 2,
            desc: 'a = [$FF00 + c]'
        },
        {
            args: ['a', '[$FF00+c]'],
            opcode: 0xF2,
            bytes: 1,
            cycles: 2,
            desc: 'a = [$FF00 + c]'
        },
        {
            args: ['a', '[$FF00+n8]'],
            opcode: 0xF0,
            bytes: 2,
            cycles: 3,
            desc: 'a = [$FF00 + n8]'
        },
        {
            args: ['[n8]', 'a'],
            opcode: 0xE0,
            bytes: 2,
            cycles: 3,
            desc: '[$FF00 + n8] = a'
        },
        {
            args: ['a', '[n8]'],
            opcode: 0xF0,
            bytes: 2,
            cycles: 3,
            desc: 'a = [$FF00 + n8]'
        }
    ],
    ldhl: [
        {
            args: ['sp', 'e8'],
            opcode: 0xF8,
            bytes: 2,
            cycles: 3,
            desc: 'hl = sp + e8 (signed)',
            flags: {
                z: '0',
                n: '0',
                h: 'Set if overflow from bit 3',
                c: 'Set if overflow from bit 7'
            }
        }
    ],
    call: [
        {
            args: ['n16'],
            opcode: 0xCD,
            bytes: 3,
            cycles: 6,
            desc: 'Call subroutine at n16'
        },
        {
            args: ['C', 'n16'],
            opcode: 0xDC,
            bytes: 3,
            cycles: 3,
            conditionalCycles: 6,
            desc: 'Call subroutine at n16 if carry flag is set'
        },
        {
            args: ['NC', 'n16'],
            opcode: 0xD4,
            bytes: 3,
            cycles: 3,
            conditionalCycles: 6,
            desc: 'Call subroutine at n16 if carry flag is not set'
        },
        {
            args: ['Z', 'n16'],
            opcode: 0xCC,
            bytes: 3,
            cycles: 3,
            conditionalCycles: 6,
            desc: 'Call subroutine at n16 if zero flag is set'
        },
        {
            args: ['NZ', 'n16'],
            opcode: 0xC4,
            bytes: 3,
            cycles: 3,
            conditionalCycles: 6,
            desc: 'Call subroutine at n16 if zero flag is not set'
        }
    ],
    jp: [
        {
            args: ['hl'],
            opcode: 0xE9,
            bytes: 1,
            cycles: 1,
            desc: 'Jump to hl'
        },
        {
            args: ['n16'],
            opcode: 0xC3,
            bytes: 3,
            cycles: 4,
            desc: 'Jump to n16'
        },
        {
            args: ['C', 'n16'],
            opcode: 0xDA,
            bytes: 3,
            cycles: 3,
            conditionalCycles: 4,
            desc: 'Jump to n16 if carry flag is set'
        },
        {
            args: ['NC', 'n16'],
            opcode: 0xD2,
            bytes: 3,
            cycles: 3,
            conditionalCycles: 4,
            desc: 'Jump to n16 if carry flag is not set'
        },
        {
            args: ['Z', 'n16'],
            opcode: 0xCA,
            bytes: 3,
            cycles: 3,
            conditionalCycles: 4,
            desc: 'Jump to n16 if zero flag is set'
        },
        {
            args: ['NZ', 'n16'],
            opcode: 0xC2,
            bytes: 3,
            cycles: 3,
            conditionalCycles: 4,
            desc: 'Jump to n16 if zero flag is not set'
        }
    ],
    jr: [
        {
            args: ['e8'],
            opcode: 0x18,
            bytes: 2,
            cycles: 3,
            desc: 'Jump to pc + e8 (signed)'
        },
        {
            args: ['C', 'e8'],
            opcode: 0x38,
            bytes: 2,
            cycles: 2,
            conditionalCycles: 3,
            desc: 'Jump to pc + e8 (signed) if carry flag is set'
        },
        {
            args: ['NC', 'e8'],
            opcode: 0x30,
            bytes: 2,
            cycles: 2,
            conditionalCycles: 3,
            desc: 'Jump to pc + e8 (signed) if carry flag is not set'
        },
        {
            args: ['Z', 'e8'],
            opcode: 0x28,
            bytes: 2,
            cycles: 2,
            conditionalCycles: 3,
            desc: 'Jump to pc + e8 (signed) if zero flag is set'
        },
        {
            args: ['NZ', 'e8'],
            opcode: 0x20,
            bytes: 2,
            cycles: 2,
            conditionalCycles: 3,
            desc: 'Jump to pc + e8 (signed) if zero flag is not set'
        }
    ],
    ret: [
        {
            args: ['C'],
            opcode: 0xD8,
            bytes: 1,
            cycles: 2,
            conditionalCycles: 5,
            desc: 'Return from subroutine if carry flag is set'
        },
        {
            args: ['NC'],
            opcode: 0xD0,
            bytes: 1,
            cycles: 2,
            conditionalCycles: 5,
            desc: 'Return from subroutine if carry flag is not set'
        },
        {
            args: ['Z'],
            opcode: 0xC8,
            bytes: 1,
            cycles: 2,
            conditionalCycles: 5,
            desc: 'Return from subroutine if zero flag is set'
        },
        {
            args: ['NZ'],
            opcode: 0xC0,
            bytes: 1,
            cycles: 2,
            conditionalCycles: 5,
            desc: 'Return from subroutine if zero flag is not set'
        },
        {
            args: [],
            opcode: 0xC9,
            bytes: 1,
            cycles: 4,
            desc: 'Return from subroutine'
        }
    ],
    reti: [
        {
            args: [],
            opcode: 0xD9,
            bytes: 1,
            cycles: 4,
            desc: 'Return from subroutine, enable interrupts'
        }
    ],
    rst: [
        {
            args: ['vec'],
            opcode: 0xC7,
            bytes: 1,
            cycles: 4,
            desc: 'Call subroutine at vec'
        }
    ],
    pop: [
        {
            args: ['af'],
            opcode: 0xF1,
            bytes: 1,
            cycles: 3,
            desc: 'Pop af from the stack',
            flags: {
                z: 'Popped from stack',
                n: 'Popped from stack',
                h: 'Popped from stack',
                c: 'Popped from stack'
            }
        },
        {
            args: ['bc'],
            opcode: 0xC1,
            bytes: 1,
            cycles: 3,
            desc: 'Pop bc from the stack'
        },
        {
            args: ['de'],
            opcode: 0xD1,
            bytes: 1,
            cycles: 3,
            desc: 'Pop de from the stack'
        },
        {
            args: ['hl'],
            opcode: 0xE1,
            bytes: 1,
            cycles: 3,
            desc: 'Pop hl from the stack'
        }
    ],
    push: [
        {
            args: ['af'],
            opcode: 0xF5,
            bytes: 1,
            cycles: 4,
            desc: 'Push af to the stack'
        },
        {
            args: ['bc'],
            opcode: 0xC5,
            bytes: 1,
            cycles: 4,
            desc: 'Push bc to the stack'
        },
        {
            args: ['de'],
            opcode: 0xD5,
            bytes: 1,
            cycles: 4,
            desc: 'Push de to the stack'
        },
        {
            args: ['hl'],
            opcode: 0xE5,
            bytes: 1,
            cycles: 4,
            desc: 'Push hl to the stack'
        }
    ],
    ccf: [
        {
            args: [],
            opcode: 0x3F,
            bytes: 1,
            cycles: 1,
            desc: 'Complement the carry flag',
            flags: {
                n: '0',
                h: '0',
                c: 'Complemented'
            }
        }
    ],
    cpl: [
        {
            args: [],
            opcode: 0x2F,
            bytes: 1,
            cycles: 1,
            desc: 'a = ~a',
            flags: {
                n: '1',
                h: '1'
            }
        }
    ],
    daa: [
        {
            args: [],
            opcode: 0x27,
            bytes: 1,
            cycles: 1,
            desc: 'Decimal adjust a to correct for BCD after arithmetic',
            flags: {
                z: 'Set if result is 0',
                h: '0',
                c: 'Varies'
            }
        }
    ],
    scf: [
        {
            args: [],
            opcode: 0x37,
            bytes: 1,
            cycles: 1,
            desc: 'Set carry flag to 1',
            flags: {
                n: '0',
                h: '0',
                c: '1'
            }
        }
    ],
    di: [
        {
            args: [],
            opcode: 0xF3,
            bytes: 1,
            cycles: 1,
            desc: 'Disable interrupts'
        }
    ],
    ei: [
        {
            args: [],
            opcode: 0xFB,
            bytes: 1,
            cycles: 1,
            desc: 'Enable interrupts'
        }
    ],
    halt: [
        {
            args: [],
            opcode: 0x76,
            bytes: 1,
            cycles: 1,
            desc: 'Enter CPU halted mode'
        }
    ],
    nop: [
        {
            args: [],
            opcode: 0x00,
            bytes: 1,
            cycles: 1,
            desc: 'No operation'
        }
    ],
    stop: [
        {
            args: [],
            opcode: 0x00,
            prefix: 0x10,
            bytes: 2,
            cycles: 1,
            desc: 'Enter CPU stopped mode'
        }
    ]
}

export default OpRules
