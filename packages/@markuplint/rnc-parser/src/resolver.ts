import { Attribute, Element, Keyword, Ref, Values, parse } from './parser';
import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import { resolve } from 'path';

const asyncReadFlie = promisify(readFile);

// @ts-ignore
Map.prototype.toJSON = function() {
	// @ts-ignore
	return Array.from(this).reduce((sum, [v, k]) => ((sum[v] = k), sum), {});
};

asyncReadFlie(resolve(__dirname, '../src/common.rnc'), { encoding: 'utf-8' }).then(rnc => {
	const grammers = parse(rnc);

	const refs: Ref[] = [];

	for (const grammer of grammers) {
		switch (grammer.type) {
			case 'ref': {
				refs.push(grammer);
			}
		}
	}

	const vars = new Map<string, Values>();

	for (const ref of refs) {
		if (vars.has(ref.variableName.name)) {
			// TODO: merging
			return;
		}
		vars.set(ref.variableName.name, ref.value);
	}

	const resolvedVars: Vars = new Map<string, Values>();
	const attrs: Attr = new Map<string, { name: string; value: string[] }>();

	resolver(resolvedVars, vars, attrs);

	const result = {
		attrs,
		ref: resolvedVars,
	};

	writeFile(resolve(__dirname, '../src/spec.json'), JSON.stringify(result, null, 2), () =>
		process.stdout.write('🎉 Generated spec.json.'),
	);
});

type Vars = Map<string, Values>;

type Attr = Map<string, { name: string; value: string | string[] }>;

function resolver(input: Map<string, Values | string>, vars: Vars, attr: Attr) {
	for (const [name, values] of vars) {
		if (Array.isArray(values)) {
			const newValues = [...values];
			for (let i = 0; i < values.length; i++) {
				const value = values[i];
				if (value.type === 'variable') {
					const rawValue = vars.get(value.name);
					if (rawValue) {
						// @ts-ignore
						newValues[i] = rawValue;
					}
				} else if (value.type === 'keyword') {
					// @ts-ignore
					newValues[i] = value.value;
				}
			}
			input.set(name, newValues);
		} else if (values.type === 'variable') {
			const rawValue = vars.get(values.name);
			if (rawValue) {
				input.set(name, rawValue);
			}
		} else if (values.type === 'element') {
			// resolver(input, values.contents);
		} else if (values.type === 'attribute') {
			const attrName =
				typeof values.name === 'string'
					? values.name
					: values.name.ns
						? `${values.name.ns}:${values.name.name}`
						: values.name.name;
			let value: string | string[];
			if (Array.isArray(values.value)) {
				// @ts-ignore
				value = values.value.map(v => v.value);
			} else {
				if (values.value.type === 'keyword') {
					value = `keyword:${values.value.value}`;
				} else if (values.value.type === 'variable') {
					const rawValue = vars.get(values.value.name);
					if (rawValue) {
						// @ts-ignore
						value = ref(rawValue, vars);
					}
				}
			}
			attr.set(name, {
				name: attrName,
				// @ts-ignore
				value,
			});
		} else if (values.type === 'keyword') {
			input.set(name, `keyword:${values.value}`);
		} else {
			input.set(name, values);
		}
	}
}

function ref(ctx: Values, vars: Vars, depth = 0): (string | Element | Attribute)[] {
	if (depth > 50) {
		throw new Error('Circular reference');
	}
	if (Array.isArray(ctx)) {
		return ctx.map(c => ref(c, vars)).flat();
	} else if (ctx.type === 'variable') {
		const rawValue = vars.get(ctx.name);
		if (rawValue) {
			return ref(rawValue, vars, depth + 1);
		} else if (ctx.ns === 'w' /* TODO: datatypes */) {
			return [`datatypes:${ctx.name}`];
		}
		return [];
	} else if (ctx.type === 'keyword') {
		return [`keyword:${ctx.value}`];
	}
	return [ctx];
}

Array.prototype.flat = function() {
	return Array.prototype.concat.apply([], this);
};
