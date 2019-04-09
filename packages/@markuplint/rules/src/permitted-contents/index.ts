import {
	ConditionalPermittedContent,
	PermittedContent,
	PermittedContentElementCategory,
	PermittedContentElementCategoryPartial,
} from '@markuplint/ml-spec';
import { Element, Result, createRule } from '@markuplint/ml-core';

export default createRule({
	name: 'permitted-contents',
	defaultValue: null,
	defaultOptions: null,
	async verify(document, messages) {
		const reports: Result[] = [];
		await document.walkOn('Element', async el => {
			const content = el.permittedContent;
			if (content == null) {
				return;
			}
			const midResult = verify(el, content);
			if (midResult) {
				let message = 'error';
				switch (midResult.errorType) {
				case 'void': {
					message = `${el.nodeName}は空要素なので、要素を内包することはできません`;
					break;
				}
				case 'element': {
					message = `${el.nodeName}要素は${midResult.unpermittedName}を許可しません`;
					break;
				}
				case 'category': {
					message = `${el.nodeName}要素は${midResult.unpermittedName}を許可しません`;
					break;
				}
				}
				reports.push({
					severity: el.rule.severity,
					message,
					line: el.startLine,
					col: el.startCol + 1,
					raw: el.nodeName,
				});
			}
		});
		return reports;
	},
});

type Elem = Element<null, null>;

type MiddleResult = {
	errorType: 'void' | 'element' | 'category';
	unpermittedName?: string;
};

function isConditinalContent(
	content: PermittedContent | ConditionalPermittedContent,
): content is ConditionalPermittedContent {
	return typeof content === 'object' && 'if' in content;
}

function verify(el: Elem, content: PermittedContent | ConditionalPermittedContent): MiddleResult | null {
	if (isConditinalContent(content)) {
		content;
	} else {
		content;
		if (content === true) {
			// i.e. Allow all element
			return null;
		} else if (content === false) {
			// i.e. Void element
			return verifyEmpty(el);
		} else if (typeof content === 'string') {
			if (content[0] === '#') {
				// i.e. Element category name
				const category = content.replace('#', '') as PermittedContentElementCategory;
				return verifyCategory(el.children, category);
			} else {
				// i.e. Element tag name
				return verifyTagName(el.children, content);
			}
		} else if ('ignore' in content) {
			// i.e. Element category partial
			return verifyCategoryPartial(el, content);
		} else if ('either' in content) {
			// i.e. Either elements
			for (const eitherContent of content.either) {
				const res = verify(el, eitherContent);
				if (res) {
					return res;
				}
			}
			return null;
		} else if ('eitherOne' in content) {
			// i.e. Either one elements
			// TODO
			return null;
		} else if (Array.isArray(content)) {
			// i.e. Ordered contents
			// TODO
			return null;
		}
		return null;
	}
	return null;
}

function isNotEmpty(el: Elem) {
	return el.children.length;
}

function getPermittedElementsByCategoryIn(elements: Elem[], category: PermittedContentElementCategory) {
	return elements.filter(el => el.matchCategory(category));
}

function getHeresyElementsByCategoryIn(elements: Elem[], category: PermittedContentElementCategory) {
	return elements.filter(el => !el.matchCategory(category));
}

function getUnmatchedElementsByTagName(elements: Elem[], tagName: string) {
	return elements.filter(el => el.nodeName.toLowerCase() !== tagName.toLowerCase());
}

function verifyEmpty(el: Elem): MiddleResult | null {
	if (isNotEmpty(el)) {
		return {
			errorType: 'void',
		};
	}
	return null;
}

function verifyTagName(elements: Elem[], tagName: string): MiddleResult | null {
	const unmatchedElements = getUnmatchedElementsByTagName(elements, tagName);
	if (unmatchedElements.length) {
		return {
			errorType: 'element',
			unpermittedName: unmatchedElements[0].nodeName,
		};
	}
	return null;
}

function verifyCategory(elements: Elem[], category: PermittedContentElementCategory): MiddleResult | null {
	const heresies = getHeresyElementsByCategoryIn(elements, category);
	if (heresies.length) {
		return {
			errorType: 'category',
			unpermittedName: heresies[0].nodeName,
		};
	}
	return null;
}

function verifyCategoryPartial(el: Elem, content: PermittedContentElementCategoryPartial): MiddleResult | null {
	const category = content.category.replace('#', '') as PermittedContentElementCategory;
	if (content.ignore.descendants) {
		const res = verifyCategory(el.descendants, category);
		if (res) {
			return res;
		}
	} else {
		const res = verifyCategory(el.children, category);
		if (res) {
			return res;
		}
	}
	const permittedElements = content.ignore.descendants
		? getPermittedElementsByCategoryIn(el.descendants, category)
		: getPermittedElementsByCategoryIn(el.children, category);
	for (const permittedElement of permittedElements) {
		for (const ignore of content.ignore.content) {
			if (ignore[0] === '#') {
				// i.e. Element category name
				const ignoreCat = ignore.replace('#', '') as PermittedContentElementCategory;
				if (permittedElement.matchCategory(ignoreCat)) {
					return {
						errorType: 'category',
						unpermittedName: permittedElement.nodeName,
					};
				}
			} else {
				// i.e. Element tag name
				if (permittedElement.nodeName.toLowerCase() === ignore.toLowerCase()) {
					return {
						errorType: 'element',
						unpermittedName: permittedElement.nodeName,
					};
				}
			}
		}
	}
	return null;
}
