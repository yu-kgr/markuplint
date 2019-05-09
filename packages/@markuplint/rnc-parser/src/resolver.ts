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

	const resolvedVars = new Map<string, Values>();

	resolver(resolvedVars, vars);

	writeFile(resolve(__dirname, '../src/spec.json'), JSON.stringify(resolvedVars, null, 2), () =>
		process.stdout.write('🎉 Generated spec.json.'),
	);
});

function resolver(input: Map<string, Values>, vars: Map<string, Values>) {
	for (const [name, values] of vars) {
		if (Array.isArray(values)) {
			const newValues = [...values];
			for (let i = 0; i < values.length; i++) {
				const value = values[i];
				if (value && value.type === 'variable') {
					const rawValue = vars.get(value.name);
					if (rawValue) {
						// @ts-ignore
						newValues[i] = rawValue;
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
			resolver(input, values.contents);
		}
		} else {
			input.set(name, values);
		}
	}
}
