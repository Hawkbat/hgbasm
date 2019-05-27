import Node from '../Node'
import Evaluator from './Evaluator'
import EvaluatorContext from './EvaluatorContext'

type ConstExprRule = (op: Node, ctx: EvaluatorContext, e: Evaluator) => number | string

export default ConstExprRule
