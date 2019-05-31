import FunctionRules from '../Evaluator/FunctionRules'
import KeywordRules from '../Evaluator/KeywordRules'
import OpRules from '../Evaluator/OpRules'
import TokenType from '../TokenType'
import ITokenRule from './ITokenRule'
import MatchType from './MatchType'

const TokenRules: ITokenRule[] = [
    {
        type: TokenType.semicolon_comment,
        start: [MatchType.one, [';']]
    },
    {
        type: TokenType.asterisk_comment,
        start: [MatchType.one, ['*']],
        startOfLine: true
    },
    {
        type: TokenType.directive,
        start: [MatchType.one, ['#']],
        startOfLine: true
    },
    {
        type: TokenType.string,
        start: [MatchType.one, ['"']],
        end: [MatchType.one, ['"']]
    },
    {
        type: TokenType.string_escape,
        rules: [[MatchType.one, ['\\\\', '\\"', '\\,', '\\{', '\\}', '\\n', '\\t']]],
        onlyAsSubToken: true
    },
    {
        type: TokenType.macro_escape,
        rules: [[MatchType.one, ['\\1', '\\2', '\\3', '\\4', '\\5', '\\6', '\\7', '\\8', '\\9', '\\@']]]
    },
    {
        type: TokenType.string_interpolation,
        rules: [
            [MatchType.one, ['{']],
            [MatchType.zeroOrMore, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_', '#', '@']],
            [MatchType.one, ['}']]
        ],
        onlyAsSubToken: true
    },
    {
        type: TokenType.macro_argument,
        end: [MatchType.one, [',', ';']],
        endLookahead: true,
        onlyAsSubToken: true
    },
    {
        type: TokenType.space,
        rules: [[MatchType.oneOrMore, [' ', '\t']]]
    },
    {
        type: TokenType.hex_number,
        rules: [
            [MatchType.one, ['$']],
            [MatchType.oneOrMore, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']]
        ]
    },
    {
        type: TokenType.function,
        rules: [[MatchType.one, Object.keys(FunctionRules)]],
        end: [MatchType.one, ['(']],
        endLookahead: true
    },
    {
        type: TokenType.keyword,
        rules: [[MatchType.one, Object.keys(KeywordRules)]]
    },
    {
        type: TokenType.region,
        rules: [[MatchType.one, ['rom0', 'romx', 'vram', 'sram', 'wram0', 'wramx', 'oam', 'hram']]]
    },
    {
        type: TokenType.opcode,
        rules: [[MatchType.one, Object.keys(OpRules)]]
    },
    {
        type: TokenType.register,
        rules: [[MatchType.one, ['a', 'f', 'b', 'c', 'd', 'e', 'h', 'l', 'af', 'bc', 'de', 'hl', 'hli', 'hld', 'hl+', 'hl-', 'sp', 'pc']]]
    },
    {
        type: TokenType.condition,
        rules: [[MatchType.one, ['z', 'nz', 'c', 'nc']]]
    },
    {
        type: TokenType.identifier,
        rules: [
            [MatchType.one, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '.', '_', '@', '#']],
            [MatchType.zeroOrMore, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '_', '@', '#']],
            [MatchType.zeroOrMore, [':']]
        ]
    },
    {
        type: TokenType.fixed_point_number,
        rules: [
            [MatchType.oneOrMore, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']],
            [MatchType.one, ['.']],
            [MatchType.oneOrMore, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']]
        ]
    },
    {
        type: TokenType.binary_number,
        rules: [
            [MatchType.one, ['%']],
            [MatchType.oneOrMore, ['0', '1']]
        ]
    },
    {
        type: TokenType.octal_number,
        rules: [
            [MatchType.one, ['&']],
            [MatchType.oneOrMore, ['0', '1', '2', '3', '4', '5', '6', '7']]
        ]
    },
    {
        type: TokenType.gbgfx_number,
        rules: [
            [MatchType.one, ['`']],
            [MatchType.oneOrMore, ['0', '1', '2', '3']]
        ]
    },
    {
        type: TokenType.decimal_number,
        rules: [[MatchType.oneOrMore, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']]]
    },
    {
        type: TokenType.operator,
        rules: [[MatchType.one, ['!=', '==', '<=', '>=', '&&', '||', '<<', '>>', '<', '>', '~', '+', '-', '*', '/', '%', '&', '|', '^', '=', '!']]]
    },
    {
        type: TokenType.comma,
        rules: [[MatchType.one, [',']]]
    },
    {
        type: TokenType.colon,
        rules: [[MatchType.one, [':']]]
    },
    {
        type: TokenType.open_bracket,
        rules: [[MatchType.one, ['[']]]
    },
    {
        type: TokenType.close_bracket,
        rules: [[MatchType.one, [']']]]
    },
    {
        type: TokenType.open_paren,
        rules: [[MatchType.one, ['(']]]
    },
    {
        type: TokenType.close_paren,
        rules: [[MatchType.one, [')']]]
    }
]

export default TokenRules
