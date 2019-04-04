import { ConditionalPermittedContent, PermittedContent } from '@markuplint/ml-spec';
import { Element, Result, createRule } from '@markuplint/ml-core';

export default createRule({
	name: 'permitted-contents',
	defaultValue: null,
	defaultOptions: null,
	async verify(document, messages) {
		const reports: Result[] = [];
		await document.walkOn('Element', async element => {
			const content = element.permittedContent;
			if (content == null) {
				return;
			}
			if (isConditinalContent(content)) {
				content;
			} else {
				content;
				if (content === true) {
					// i.e. Allow all element
					return;
				} else if (content === false) {
					// i.e. Void element
					if (element.children.length) {
						reports.push({
							severity: element.rule.severity,
							message: `${element.nodeName}は空要素なので、要素を内包することはできません`,
							line: element.startLine,
							col: element.startCol + 1,
							raw: element.nodeName,
						});
					}
				} else if ('either' in content) {
					for (const el of content.either) {
						if (typeof el === 'string') {
							el;
						}
					}
				} else if ('only' in content) {
					const permittedContent = content.only;
					if (element.children.some(el => !el.matchCategoryOrTagName(permittedContent))) {
						reports.push({
							severity: element.rule.severity,
							message: `${element.nodeName}要素は${permittedContent}を許可しません`,
							line: element.startLine,
							col: element.startCol + 1,
							raw: element.nodeName,
						});
					}
				} else if ('zeroOrMore' in content) {
					const permittedContents = Array.isArray(content.zeroOrMore)
						? content.zeroOrMore
						: [content.zeroOrMore];

					let unpermittedElement: Element<null, null> | void;

					check: for (const child of element.children) {
						for (const permittedContent of permittedContents) {
							if (!child.matchCategoryOrTagName(permittedContent)) {
								unpermittedElement = child;
								break check;
							}
						}
					}
					if (unpermittedElement) {
						reports.push({
							severity: element.rule.severity,
							message: `${element.nodeName}要素は${unpermittedElement.nodeName}要素を許可しません`,
							line: unpermittedElement.startLine,
							col: unpermittedElement.startCol + 1,
							raw: unpermittedElement.nodeName,
						});
					}
				}
			}
			// if (spec && (spec.obsolete || spec.deprecated || spec.nonStandard)) {
			// 	reports.push({
			// 		severity: node.rule.severity,
			// 		message,
			// 		line: node.startLine,
			// 		col: node.startCol + 1,
			// 		raw: node.nodeName,
			// 	});
			// }
		});
		return reports;
	},
});

function isConditinalContent(
	content: PermittedContent | ConditionalPermittedContent,
): content is ConditionalPermittedContent {
	return typeof content === 'object' && 'if' in content;
}
