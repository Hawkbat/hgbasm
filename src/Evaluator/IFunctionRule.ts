import Node from '../Node'
import Evaluator from './Evaluator'
import EvaluatorContext from './EvaluatorContext'
import IFunctionParameter from './IFunctionParameter'
import IFunctionReturn from './IFunctionReturn'

export default interface IFunctionRule {
    params: IFunctionParameter[]
    return: IFunctionReturn
    desc: string
    rule: (op: Node, ctx: EvaluatorContext, e: Evaluator) => string | number
}
