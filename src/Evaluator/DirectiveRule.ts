import Evaluator from './Evaluator'
import EvaluatorContext from './EvaluatorContext'

type DirectiveRule = (ctx: EvaluatorContext, args: string[], e: Evaluator) => void

export default DirectiveRule
