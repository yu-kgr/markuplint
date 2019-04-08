import { ConditionalPermittedContent, PermittedContent } from '@markuplint/ml-spec';
import { Result, createRule } from '@markuplint/ml-core';

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
				} else if (typeof content === 'string') {
					if (content[0] === '#') {
						// i.e. Element category name
						const permittedContent = content;
						if (element.children.some(el => !el.matchCategoryOrTagName(permittedContent))) {
							reports.push({
								severity: element.rule.severity,
								message: `${element.nodeName}要素は${permittedContent}を許可しません`,
								line: element.startLine,
								col: element.startCol + 1,
								raw: element.nodeName,
							});
						}
					} else {
						// i.e. Element tag name
						if (element.children.some(el => el.nodeName.toLowerCase() !== content.toLowerCase())) {
							reports.push({
								severity: element.rule.severity,
								message: `${element.nodeName}要素は${content}を許可しません`,
								line: element.startLine,
								col: element.startCol + 1,
								raw: element.nodeName,
							});
						}
					}
				} else if ('ignore' in content) {
					// i.e. Element category partial
					content;
				} else if ('either' in content) {
					// i.e. Either elements
					for (const eitherContent of content.either) {
						eitherContent;
					}
				} else if ('eitherOne' in content) {
					// i.e. Either one elements
					for (const eitherOneContent of content.eitherOne) {
						eitherOneContent;
					}
				} else if (Array.isArray(content)) {
					// i.e. Ordered contents
					// let unpermittedElement: Element<null, null> | void;
					// check: for (const child of element.children) {
					// 	for (const permittedContent of permittedContents) {
					// 		if (!child.matchCategoryOrTagName(permittedContent)) {
					// 			unpermittedElement = child;
					// 			break check;
					// 		}
					// 	}
					// }
					// if (unpermittedElement) {
					// 	reports.push({
					// 		severity: element.rule.severity,
					// 		message: `${element.nodeName}要素は${unpermittedElement.nodeName}要素を許可しません`,
					// 		line: unpermittedElement.startLine,
					// 		col: unpermittedElement.startCol + 1,
					// 		raw: unpermittedElement.nodeName,
					// 	});
					// }
				}
			}
		});
		return reports;
	},
});

function isConditinalContent(
	content: PermittedContent | ConditionalPermittedContent,
): content is ConditionalPermittedContent {
	return typeof content === 'object' && 'if' in content;
}
