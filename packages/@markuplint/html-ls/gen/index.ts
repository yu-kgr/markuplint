import fs from 'fs';
import path from 'path';
import util from 'util';
import fetch, { getReferences } from './fetch';
import { ElementSpec, MLMLSpecJSON } from './types';
import { getGlobalAttrs } from './global-attrs';
import { getHTMLElements } from './html-elements';

const writeFile = util.promisify(fs.writeFile);

async function main() {
	const outputFilePath = path.resolve(__dirname, `../__test.json`);

	const specs = await getHTMLElements();
	const globalAttrs = await getGlobalAttrs();

	const cites = getReferences();

	const json: MLMLSpecJSON = {
		cites,
		def: {
			'#globalAttrs': globalAttrs,
		},
		specs,
	};

	const jsonString = JSON.stringify(json, null, 2);

	await writeFile(outputFilePath, jsonString);
	console.log(`🎁 Output: ${outputFilePath}`);
}

main();
