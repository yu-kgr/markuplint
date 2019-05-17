start = Doc

Doc = block:Block+ {
	return block.filter(_ => _);
}

Block = _ block:(Include /DefaultDef / DatatypeDef / Ref / Comment) _ {
	return block;
}

DatatypeDef = "datatypes" _ def:Ref  {
	return {
		...def,
		type: "datatypes",
	}
}

DefaultDef = "default" _ def:Ref  {
	return {
		...def,
		type: "default",
	}
}

Include = "include" _ file:String _override:(_ "{" Doc "}")? {
	const res = {
		type: "include",
		file,
	}
	if (_override && _override[2]) {
		res.override = _override[2];
	}
	return res;
}

Ref = variableName:Identifier _ defType:("=" / "|=" / "&=") _ value:(Identifiers / String / ListDef / NodeDef / MultipleDef / Identifier) merge:(_ "&" _ Identifier)? {
	const ref = {
	type: defType === "=" ? "ref" : defType === "|=" ? "marge-or" : "marge-and",
		variableName: variableName,
		value,
	}
	if (merge) ref.merge = merge[3]
	return ref
}

NodeDef = nodeType:NodeType _ name:(AnyType/NodeName) _ "{" _  contents:(AttrValue / Identifiers / Identifier) _ "}" required:Required {
	switch (nodeType) {
		case "element":
			return {
				type: nodeType,
				name,
				contents,
				required,
			}
		case "attribute":
			return {
				type: nodeType,
				name,
				value: contents,
				required,
		}
	}
}


ListDef = "list" _ "{" _  contents:(RegExp / AttrValue / Identifiers / Identifier) _ "}" required:Required {
	return {
		list: contents,
		required,
	}
}

MultipleDef = "(" _ ids:(Identifiers / Identifier) _ ")"  {
	return ids
}

NodeType = "element" / "attribute"

NodeName = nsNodeName / nonnsNodeName

nsNodeName = ns:$[a-zA-Z0-9]+ ":" name:nonnsNodeName {
	return { ...name, ns }
}

nonnsNodeName = name:$[a-zA-Z0-9-]+ {
	return { name }
}

AnyType = "*"

Identifiers = IdentifiersAndList / IdentifiersOrList / IdentifiersCommaList

IdentifiersAndList = ids:(Identifier _ "&" _)+ lastId:Identifier {
	return {and: [...ids.map(id => id[0]), lastId]}
}

IdentifiersOrList = ids:(Identifier _ "|" _)+ lastId:Identifier {
	return {or: [...ids.map(id => id[0]), lastId]}
}

IdentifiersCommaList = ids:(Identifier _ "," _)+ lastId:Identifier {
	return {comma: [...ids.map(id => id[0]), lastId]}
}

Identifier = id:(MultipleDef / ListDef / RegExp / TypedValue / Variable / Keyword) required:Required {
	id.required = required
	return id
}

TypedValue = type:ValueType _ rawValue:String {
	return {
		type,
		rawValue,
	}
}

Keyword = keyword:("empty" / "notAllowed" / "text" / "token") {
	return {
		type:"keyword",
		value: keyword
	}
}


Variable = nsVariable / nonnsVariable

nsVariable = ns:$[a-zA-Z0-9]+ ":" name:nonnsVariable {
	return { ...name, ns }
}

nonnsVariable = name:$[a-zA-Z0-9-.]+ {
	return {
		type: "variable",
		name,
	}
}

AttrValue =  values:(Constant _ "|" _)+ lastValue:Constant {
	return [...values.map(v => v[0]), lastValue]
}

Constant = valueType:ValueType _ value:String {
	return {
		type: "constant",
		valueType,
		value,
	}
}

RegExp = valueType:ValueType _ "{" _ "pattern" _ "=" _ pattern:String  _ "}" required:Required {
	return {
		type: "regexp-pattern",
		pattern,
	}
}

Comment = "#" comment:$[^\n]* {
	return null
}


ValueType = nsValueType / nonnsValueType

nsValueType = ns:$[a-zA-Z0-9]+ ":" valueType:nonnsValueType {
	return { ...valueType, ns }
}

nonnsValueType = valueType:ValueTypeEnum {
	return { valueType }
}

ValueTypeEnum = "string" / "token"

String = DoubleQuoteString / SingleQuoteString

DoubleQuoteString = str:('"' $[^"]* '"') {
	return str[1]
}

SingleQuoteString = str:("'" $[^']* "'") {
	return str[1]
}

Required = token:("*" / "+" / "?" / "") {
	switch (token) {
		case "*": return "zeroOrMore";
		case "+": return "oneOrMore";
		case "?": return "optional"
		case "": return "required"
	}
}

_ = (WHITESPACE Comment WHITESPACE)+ / WHITESPACE
WHITESPACE = [ \t\n\r]*
