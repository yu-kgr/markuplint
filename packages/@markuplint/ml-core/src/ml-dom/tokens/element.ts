import { AnonymousNode, Document } from '../';
import { ElementCategory, ElementCondition, MLDOMElementSpec, getSpecByTagName } from '@markuplint/ml-spec';
import { MLDOMAttribute, MLDOMElementCloseTag, MLDOMNode } from './';
import { createSelector, getNode } from '../helper';
import { IMLDOMElement } from '../types';
import { MLASTElement } from '@markuplint/ml-ast';
import { RuleConfigValue } from '@markuplint/ml-config';
import { syncWalk } from '../document';

export default class MLDOMElement<T extends RuleConfigValue, O = null> extends MLDOMNode<T, O, MLASTElement>
	implements IMLDOMElement {
	public readonly type = 'Element';
	public readonly nodeName: string;
	public readonly attributes: MLDOMAttribute[];
	public readonly namespaceURI: string;
	public readonly isForeignElement: boolean;
	public readonly closeTag: MLDOMElementCloseTag<T, O> | null;

	private readonly _spec: Readonly<MLDOMElementSpec> | null = null;
	private _cat: ElementCategory[] | null = null;

	constructor(astNode: MLASTElement, document: Document<T, O>) {
		super(astNode, document);
		this.nodeName = astNode.nodeName;
		this.attributes = astNode.attributes.map(attr => new MLDOMAttribute(attr));
		this.namespaceURI = astNode.namespace;
		this.isForeignElement = this.namespaceURI !== 'http://www.w3.org/1999/xhtml';
		this.closeTag = astNode.pearNode ? new MLDOMElementCloseTag<T, O>(astNode.pearNode, document, this) : null;
		this._spec = Object.freeze(getSpecByTagName(this.nodeName, document.specs));
	}

	public get childNodes(): AnonymousNode<T, O>[] {
		const astChildren = this._astToken.childNodes || [];
		return astChildren.map(node => getNode<typeof node, T, O>(node));
	}

	public get children(): MLDOMElement<T, O>[] {
		return this.childNodes.filter((node): node is MLDOMElement<T, O> => node instanceof MLDOMElement);
	}

	public get classList() {
		const classAttr = this.getAttributeToken('class');
		if (classAttr && classAttr.value) {
			return classAttr.value.raw
				.split(/\s+/g)
				.map(c => c.trim())
				.filter(c => c);
		}
		return [];
	}

	public get id() {
		const idAttr = this.getAttributeToken('id');
		if (idAttr && idAttr.value) {
			return idAttr.value.raw;
		}
		return '';
	}

	public get experimental() {
		return this._spec ? this._spec.experimental : false;
	}

	public get obsolete() {
		return this._spec ? this._spec.obsolete : false;
	}

	public get deprecated() {
		return this._spec ? this._spec.deprecated : false;
	}

	public get nonStandard() {
		return this._spec ? this._spec.nonStandard : false;
	}

	public get categories(): ElementCategory[] {
		if (this._cat) {
			return this._cat;
		}
		if (!this._spec) {
			return [];
		}
		const categories: ElementCategory[] = [];
		for (const cat of this._spec.categories) {
			if (typeof cat === 'string') {
				categories.push(cat);
			} else {
				if (this._if(cat.if)) {
					categories.push(cat.then);
				} else if (cat.else) {
					categories.push(cat.else);
				}
			}
		}
		this._cat = categories;
		return categories;
	}

	public get permittedContent() {
		return this._spec ? this._spec.permittedContent.content : null;
	}

	public getElementsByTagName(tagName: string): MLDOMElement<T, O>[] {
		return this._getDescendantElements().filter(el => el.nodeName === tagName);
	}

	public getAttributeToken(attrName: string) {
		for (const attr of this.attributes) {
			if (attr.name.raw.toLowerCase() === attrName.toLowerCase()) {
				return attr;
			}
		}
	}

	public getAttribute(attrName: string) {
		for (const attr of this.attributes) {
			if (attr.name.raw.toLowerCase() === attrName.toLowerCase()) {
				return attr.value ? attr.value.raw : null;
			}
		}
		return null;
	}

	public hasAttribute(attrName: string) {
		return !!this.getAttributeToken(attrName);
	}

	public matches(selector: string): boolean {
		return createSelector(selector).match(this);
	}

	public matchCategory(category: ElementCategory) {
		return this.categories.includes(category);
	}

	public matchCategoryOrTagName(name: string) {
		if (this.nodeName === name) {
			return true;
		}
		return this.categories.includes(name as ElementCategory);
	}

	private _getDescendantNodes() {
		const nodes: AnonymousNode<T, O>[] = [];
		syncWalk([this], nodes.push);
		return nodes;
	}

	private _getDescendantElements() {
		return this._getDescendantNodes().filter(
			(node: AnonymousNode<T, O>): node is MLDOMElement<T, O> => node instanceof MLDOMElement,
		);
	}

	private _if(condition: ElementCondition) {
		if (condition.hasAttr) {
			return this.hasAttribute(condition.hasAttr);
		}
	}
}
