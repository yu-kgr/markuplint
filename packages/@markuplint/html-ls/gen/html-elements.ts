import { ElementSpec, ElementCategories } from './types';
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
	const categories: ElementCategories = [];

	const cat = getProperty($, 'Content categories');
	if (/transparent/i.test(cat)) categories.push('transparent');
	if (/metadata content/i.test(cat)) categories.push('metadata');
	if (/flow content/i.test(cat)) categories.push('flow');
	if (/sectioning content/i.test(cat)) categories.push('sectioning');
	if (/heading content/i.test(cat)) categories.push('heading');
	if (/phrasing content/i.test(cat)) categories.push('phrasing');
	if (/embedded content/i.test(cat)) categories.push('embedded');
	if (/interactive content/i.test(cat)) categories.push('interactive');
	if (/palpable content/i.test(cat)) categories.push('palpable');
	if (/script-supporting/i.test(cat)) categories.push('script-supporting');

	const spec: ElementSpec = {
		name,
		cite: link,
		description,
		categories,
		contentModel: [],
		omittion: false,
		attributes: ['#globalAttrs'],
	};

	return spec;
}

function getProperty($: CheerioStatic, prop: string) {
	const $tr = $('#wikiArticle table.properties tr');
	const $th = $(
		$tr
			.find('th')
			.toArray()
			.filter(el => new RegExp(prop, 'i').test($(el).text())),
	);
	return $th.siblings('td').text();
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
