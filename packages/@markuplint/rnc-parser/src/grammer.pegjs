start = Doc

__ = Comment+ / AnySpace

_ = Comment+ / Whitespace

Comment = AnySpace "#" comment:$[^\n]* AnySpace

AnySpace = Whitespace*

Whitespace = [ \t\n\r]+

Doc = block:(Block+ / __ / "") {
	return block ? block.filter(_ => _) : [];
}

Block = __ block:(Include / NamespaceDef / DatatypeDef / Define) __ {
	return block;
}

DatatypeDef = "datatypes" __ name:($[a-zA-Z0-9._-]) __ "=" __ value:StringToken  {
	return {
		type: "datatypes",
		name,
		value,
	}
}

NamespaceDef = defaults:("default" __)? "namespace" __ name:($[a-zA-Z0-9._-]+ __)? "=" __ value:StringToken  {
	return {
		type: "namespace",
		name: name ? name[0] : null,
		value,
		isDefault: !!defaults,
	}
}

Include = "include" __ filePath:StringToken _override:(__ "{" Doc  "}")? {
	const res = {
		type: "include",
		filePath,
	}
	if (_override && _override[2]) {
		res.override = _override[2];
	}
	return res;
}

Define = name:$[a-zA-Z0-9._-]+ _ defType:("=" / "|=" / "&=") _ contents:(Expression)  {
	const define = {
		type: "define",
		name,
	};
	switch (defType) {
		case "=": define.contents = contents; break;
		case "|=": define.choice = contents; break;
		case "&=": define.interleave = contents; break;
	}
	return define;
}

Expression = ex:(Group / Identifiers / Identifier) {
	return Array.isArray(ex) ? ex : [ex];
};

Group = "(" __ contents:(Identifiers / Identifier) __ ")" __ required:Required {
	return {
		type: "group",
		contents,
		...required,
	}
}

Identifiers = IdentifiersAndList / IdentifiersOrList / IdentifiersCommaList

IdentifiersOrList = ids:(Identifier __ "|" __)+ lastId:Identifier {
	return [{choice: [...ids.map(id => id[0]), lastId]}]
}

IdentifiersAndList = ids:(Identifier __ "&" __)+ lastId:Identifier {
	return [{interleave: [...ids.map(id => id[0]), lastId]}]
}

IdentifiersCommaList = ids:(Identifier __ "," __)+ lastId:Identifier {
	return [...ids.map(id => id[0]), lastId]
}

Identifier = expression:(Group / Element / Attribute / Data / List / StringValue / Keyword / Ref) required:Required {
	return {
		...expression,
		...required,
	}
}

Element = "element" _ name:(ElementName) __ "{" __ contents:Expression? __ "}" {
	return {
		type: "element",
		name,
		contents,
	}
}

ElementName = $[a-zA-Z0-9]+ / "*"

Attribute = "attribute" _ name:(AttrName) __ "{" __  values:(Group / AttrValues) __ "}" {
	return {
		type: "attribute",
		...name,
		values,
	}
}

AttrName =  AttrNameWithNot / AttrNameSingle

AttrNameSingle = name:(MultipleNodeName / NodeName) {
	return {...name}
}

AttrNameWithNot = name:AttrNameSingle not:(_ "-" _ (MultipleNodeName / NodeName)) {
	return {...name, not: not[3]}
}

MultipleNodeName = "(" _ names:(NodeNamesOrList / NodeName) _ ")"  {
	return names
}

NodeNamesOrList = ids:(NodeName _ "|" _)+ lastId:NodeName {
	return {or: [...ids.map(id => id[0]), lastId]}
}

NodeName = nsNodeName / nonnsNodeName

nsNodeName = ns:$[a-zA-Z0-9]+ ":" name:nonnsNodeName {
	return { ...name, ns }
}

nonnsNodeName = name:($[a-zA-Z0-9-] / "*")+ {
	return { name: name.join('') }
}

AttrValues = List / AttrRefs

AttrRefs = refs:(AttrRef __ "|" __)* lastRef:AttrRef {
	return [...refs.map(ref => ref[0]), lastRef]
}

AttrRef = StringValue / Keyword / Ref

Ref = ns:($[a-zA-Z0-9]+ ":")? name:$[a-zA-Z0-9-.]+ {
	if (ns) {
		return {
			type: "ref",
			ns: ns[0],
			name,
		}
	}
	return {
		type: "ref",
		name,
	}
}

Keyword = keyword:("empty" / "notAllowed" / "text" / "token") {
	return {
		type:"keyword",
		name: keyword
	}
}

List = "list" _ "{" __  values:((Data / Keyword / Ref) Required)* __ "}" {
	return {
		type: "list",
		values: values.map(item => {
			return {
				...item[0],
				...item[1],
			}
		}),
	}
}

StringValue = ns:($[a-z0-9]+ ":")? type:$[a-z0-9]+ _ value:StringToken {
	return {
    	type,
		ns: ns ? ns[0] : null,
		value,
	}
}

Data = ns:($[a-z0-9]+ ":")? type:$[a-z0-9]+ __ "{" __ params:DataParams __ "}" {
	return {
		type,
		ns: ns ? ns[0] : null,
		params,
	}
}

DataParams = firstParam:DataParam params:(_ DataParam)*  {
	let result = {...firstParam};
	for (const p of params) {
		result = {...result, ...p[1]};
	}
	return result;
}

DataParam = prop:$[a-z0-9]+ __ "=" __ value:StringToken {
	return {
		[prop]: value,
	}
}

StringToken = str:('"' $[^"]* '"') {
	return str[1]
}

Required = token:("*" / "+" / "?" / "") {
	switch (token) {
		case "*": return {required: "zeroOrMore"};
		case "+": return {required:"oneOrMore"};
		case "?": return {required:"optional"};
		case "": return {};
	}
}