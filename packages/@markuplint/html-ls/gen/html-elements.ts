import { ElementSpec } from './types';
import fetch from './fetch';

export async function getHTMLElements() {
	const links = await getHTMLElementLinks();
	const specs = await Promise.all(links.map(getHTMLElement));
	// @ts-ignore
	return specs.sort((a, b) => a.name - b.name);
}

export async function getHTMLElement(link: string) {
	const $ = await fetch(link);
	const h1 = $('h1').text();
	const [_ = null, name = '', description = ''] = h1.match(/^<([a-z0-9_-]+)>\s*:\s*(.*)$/i) || [];

	const spec: ElementSpec = {
		name,
		description,
		categories: [],
		contentModel: [],
		omittion: false,
		attributes: ['#globalAttrs'],
	};

	return spec;
}

async function getHTMLElementLinks() {
	const $ = await fetch('https://developer.mozilla.org/en-US/docs/Web/HTML/Element');
	const $listHeading = $(
		$('#quick-links details summary')
			.toArray()
			.filter(el => /html elements/i.test($(el).text()))[0],
	);
	const $list = $listHeading.siblings('ol,ul');
	const lists = $list
		.find('li a')
		.toArray()
		.map(el => `https://developer.mozilla.org${$(el).attr('href')}`);

	return lists;
}
