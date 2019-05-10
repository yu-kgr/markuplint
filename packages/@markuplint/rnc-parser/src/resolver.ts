import { Ref, Values, parse } from './parser';
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
	const attrs: Attr = new Map<string, { name: string; values: string[] }>();

	resolver(resolvedVars, vars, attrs);

	const result = {
		ref: resolvedVars,
		attrs,
	};

	writeFile(resolve(__dirname, '../src/spec.json'), JSON.stringify(result, null, 2), () =>
		process.stdout.write('🎉 Generated spec.json.'),
	);
});

type Vars = Map<string, Values>;

type Attr = Map<string, { name: string; values: string[] }>;

function resolver(input: Map<string, Values | string>, vars: Vars, attr: Attr) {
	for (const [name, values] of vars) {
		if (Array.isArray(values)) {
			const newValues = [...values];
			for (let i = 0; i < values.length; i++) {
				const value = values[i];
				if (value) {
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
			// resolver(input, values.contents);
			// const v = Array.isArray(values.contents) ? values.contents.map()
			attr.set(name, { name: values.name, values: ['属性'] });
		} else if (values.type === 'keyword') {
			input.set(name, values.value);
		} else {
			input.set(name, values);
		}
	}
}
