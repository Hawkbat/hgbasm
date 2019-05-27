import ILineState from '../LineState/ILineState'
import Node from '../Node'
import Evaluator from './Evaluator'
import EvaluatorContext from './EvaluatorContext'

type KeywordRule = (state: ILineState, op: Node, label: Node | null, ctx: EvaluatorContext, e: Evaluator) => void | Promise<void>

export default KeywordRule
