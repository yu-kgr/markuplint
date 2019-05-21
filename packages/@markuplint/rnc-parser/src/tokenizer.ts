// @ts-ignore
import { SyntaxError as _SyntaxError, parse as _parse } from './_tokenizer';

export interface ISyntaxError {}

export type GrammerType = 'datatypes' | 'default' | 'include' | 'ref' | 'marge-or' | 'marge-and';

export type RefType = 'variable' | 'constant';

export type DirectiveType = 'element' | 'attribute';

export type ValudType = 'keyword' | 'regexp-pattern';

export type RequiredType = 'zeroOrMore' | 'oneOrMore' | 'optional' | 'required';

export type Variable = {
	type: 'variable';
	name: string;
	ns?: string;
	required: RequiredType;
};

export type Keyword = {
	type: 'keyword';
	value: string;
};

export type Element = {
	type: 'element';
	name: string;
	contents: Values;
};

export type Attribute = {
	type: 'attribute';
	name:
		| string
		| {
				name: string;
				ns?: string;
		  };
	value: Values;
};

export type Value = Variable | Keyword | Element | Attribute;

export type Values = Value | Value[] | OrValues | AndValues;

export type OrValues = { or: Value[] };
export type AndValues = { and: Value[] };

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

export interface Merge extends _Grammer {
	type: 'marge-or' | 'marge-and';
	variableName: {
		type: 'variable';
		name: string;
		required: RequiredType;
	};
	value?: Values;
}

export interface Include extends _Grammer {
	type: 'include';
	filePath: string;
}

export type Grammer = Ref | Merge | Include;

interface ParseFunction {
	(input: string, options?: any): Grammer[];
}

export const SyntaxError: ISyntaxError = _SyntaxError;
export const parse: ParseFunction = _parse;
