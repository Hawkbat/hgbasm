
enum NodeType {
    unknown,
    invalid,
    line,
    comment,
    string,
    unary_operator,
    binary_operator,
    function,
    function_call,
    opcode,
    macro_call,
    register,
    condition,
    label,
    identifier,
    number_literal,
    indexer,
    keyword,
    region
}

export default NodeType
