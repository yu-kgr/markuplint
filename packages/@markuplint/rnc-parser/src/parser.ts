// @ts-ignore
import { SyntaxError as _SyntaxError, parse as _parse } from './_parser';

export interface ISyntaxError {}

export type GrammerType = 'datatypes' | 'default' | 'include' | 'ref' | 'marge-or' | 'marge-and';

export type RefType = 'variable' | 'constant';

export type DirectiveType = 'element' | 'attribute';

export type ValudType = 'keyword' | 'regexp-pattern';

export type RequiredType = 'zeroOrMore' | 'oneOrMore' | 'optional' | 'required';

type Variable = {
	type: 'variable';
	name: string;
	ns?: string;
	required: RequiredType;
};

type Keyword = {
	type: 'keyword';
	value: string;
};

type Element = {
	type: 'element';
	name: string;
	contents: Values;
};

type Attribute = {
	type: 'attribute';
	name: string;
	contents: Values;
};

type Value = Variable | Keyword | Element | Attribute;

export type Values = Value | Value[];

interface _Grammer {
	type: GrammerType;
}

export interface Ref extends _Grammer {
	type: 'ref';
	variableName: {
		type: 'variable';
		name: string;
		required: RequiredType;
	};
	value: Values;
}

export type Grammer = Ref;

interface ParseFunction {
	(input: string, options?: any): Grammer[];
}

export const SyntaxError: ISyntaxError = _SyntaxError;
export const parse: ParseFunction = _parse;
