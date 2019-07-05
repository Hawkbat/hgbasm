import IFunctionRule from '../Evaluator/IFunctionRule'
import IOpVariant from '../Evaluator/IOpVariant'
import ILabel from '../LineState/ILabel'
import IMacro from '../LineState/IMacro'
import INumberEquate from '../LineState/INumberEquate'
import ISet from '../LineState/ISet'
import IStringEquate from '../LineState/IStringEquate'

export default interface IAutoCompleterResult {
    keywords?: { [key: string]: string }
    instructions?: { [key: string]: IOpVariant[] }
    functions?: { [key: string]: IFunctionRule }
    predefines?: { [key: string]: string }
    regions?: { [key: string]: string }
    numberEquates?: { [key: string]: INumberEquate }
    sets?: { [key: string]: ISet }
    labels?: { [key: string]: ILabel }
    macros?: { [key: string]: IMacro }
    stringEquates?: { [key: string]: IStringEquate }
}
