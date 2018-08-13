import { createRule } from '@markuplint/ml-core';

import axe from 'axe-core';
import { JSDOM } from 'jsdom';

export default createRule({
	name: 'axe',
	defaultLevel: 'warning',
	defaultValue: null,
	defaultOptions: null,
	async verify(reports, document, messages) {
		const vdom = new JSDOM();
		vdom.window.document.body.innerHTML = document.nodeList.map(node => node.raw).join('\n');
		const r = await axe.run(vdom.window.document.body, {
			runOnly: {
				type: 'tag',
				values: ['wcag2a', 'wcag2aa', 'best-practice'],
			},
		});
		console.log({ r });
	},
});
