// @ts-ignore
import { SyntaxError as _SyntaxError, parse as _parse } from './_parser';

export interface ISyntaxError {}

export type GrammerType = 'datatypes' | 'default' | 'include' | 'ref' | 'marge-or' | 'marge-and';

export type RefType = 'variable' | 'constant';

export type DirectiveType = 'element' | 'attribute';

export type ValudType = 'keyword' | 'regexp-pattern';

export interface Grammer {
	type: GrammerType;
}

interface ParseFunction {
	(input: string, options?: any): Grammer[];
}

export const SyntaxError: ISyntaxError = _SyntaxError;
export const parse: ParseFunction = _parse;
