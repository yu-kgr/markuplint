/**
 * markuplit Markup-language spec
 */
export interface MLMLSpec {
	$schema?: string;

	/**
	 * Reference URLs
	 */
	cites?: string[];
	def?: {
		'#globalAttrs'?: Attribute[];
		'#roles'?: ARIRRoleAttribute[];
		'#ariaAttrs'?: ARIAAttribute[];
	};
	specs: ElementSpec[];
}

/**
 * Element spec
 */
export type ElementSpec = {
	/**
	 * Tag name
	 */
	name: string;

	/**
	 * Reference URL
	 */
	cite: string;

	/**
	 * Description
	 */
	description?: string;

	/**
	 * Experimental technology
	 */
	experimental?: true;

	/**
	 * Obsolete or alternative elements
	 */
	obsolete?:
		| true
		| {
				alt: string;
		  };

	/**
	 * Deprecated
	 */
	deprecated?: true;

	/**
	 * Non-standard
	 */
	nonStandard?: true;

	/**
	 * Element cateogries
	 */
	categories: ElementCategories;

	/**
	 * Permitted content
	 */
	permittedContent: PermittedContentSpec;

	/**
	 * Permitted ARIA roles
	 */
	permittedRoles: {
		summary: string;
		roles: PermittedRolesSpec;
	};

	/**
	 * Tag omittion
	 */
	omittion: ElementSpecOmittion;

	/**
	 * Attributes
	 */
	attributes: (AttributeSpec | string)[];
};

export type ElementCategories = (ElementCategory | ConditionalElementCategory)[];

/**
 * Element Category
 *
 * @cite https://html.spec.whatwg.org/multipage/dom.html#kinds-of-content
 */
export type ElementCategory =
	| 'transparent'
	| 'metadata'
	| 'flow'
	| 'sectioning'
	| 'heading'
	| 'phrasing'
	| 'embedded'
	| 'interactive'
	| 'palpable'
	| 'script-supporting';

export type PermittedContentSpec = {
	summary: string;
	content: PermittedContent | ConditionalPermittedContent;
};

export type PermittedContent =
	| PermittedContentEmpty
	| PermittedContentAlways
	| PermittedContentTagName
	| PermittedContentElementCategory
	| PermittedContentElementCategoryPartial
	| PermittedContentEither
	| PermittedContentEitherOne
	| PermittedContentOrder;

export type PermittedContentEmpty = false;

export type PermittedContentAlways = true;

export type PermittedContentTagName = string;

export type PermittedContentElementCategory = ElementCategory;

export type PermittedContentElementCategoryPartial = {
	category: PermittedContentElementCategory;
	ignore: {
		content: (PermittedContentTagName | PermittedContentElementCategory)[];
		descendants?: true;
	};
};

export type PermittedContentEither = {
	either: (PermittedContentTagName | PermittedContentElementCategory | PermittedContentElementCategoryPartial)[];
};

export type PermittedContentEitherOne = {
	eitherOne: (PermittedContentTagName | PermittedContentElementCategory | PermittedContentElementCategoryPartial)[];
};

export type PermittedContentOrder = {
	count: 'zero-or-one' | 'zero-or-more' | 'one' | 'one-or-more';
	content:
		| PermittedContentTagName
		| PermittedContentElementCategory
		| PermittedContentElementCategoryPartial
		| PermittedContentEither
		| PermittedContentEitherOne;
}[];

export type PermittedRolesSpec = {};

export type ElementSpecOmittion = false | ElementSpecOmittionTags;

type ElementSpecOmittionTags = {
	startTag: boolean | ConditionalElementSpecOmittionTags;
	endTag: boolean | ConditionalElementSpecOmittionTags;
};

export type ElementCondition = {
	hasAttr?: string;
};

interface Conditional {
	if: ElementCondition;
	then: unknown;
	else?: unknown;
}

interface ConditionalElementCategory extends Conditional {
	then: ElementCategory;
	else?: ElementCategory;
}

export interface ConditionalPermittedContent extends Conditional {
	then: PermittedContent;
	else?: PermittedContent;
}

interface ConditionalElementSpecOmittionTags extends Conditional {
	then: boolean;
	else?: boolean;
}

export type Attribute = {
	name: string;
	description: string;
	category: AttributeCtegory;
	experimental?: true;
	obsolete?: true;
	deprecated?: true;
	nonStandard?: true;
	value: AttributeValue;
};

export type AttributeSpec = Attribute & {
	required?: true;
};

export type AttributeCtegory = 'global' | 'xml' | 'aria' | 'eventhandler' | 'form' | 'particular';

export type AttributeValue = 'string' | 'space-separated-tokens' | 'function-body' | 'uint' | 'int' | 'float';

export type ARIRRoleAttribute = {
	name: string;
	description: string;
	isAbstract?: true;
	generalization: string[];
	ownedAttribute: string[];
};

export type ARIAAttribute = {
	name: string;
	type: 'property' | 'state';
	deprecated?: true;
	value: ARIAAttributeValue;
	defaultValue?: string;
};

export type ARIAAttributeValue =
	| 'true/false'
	| 'tristate'
	| 'true/false/undefined'
	| 'ID reference'
	| 'ID reference list'
	| 'integer'
	| 'number'
	| 'string'
	| 'token'
	| 'token list'
	| 'URI';
