start = Doc

Doc = block:Block+ {
	return block.filter(_ => _);
}

Block = _ block:(DatatypeDef / Ref / Comment) _ {
	return block;
}

DatatypeDef = "datatypes" _ def:Ref  {
	return {
        ...def,
    	type: "datatypes",
    }
}

Ref = variableName:Identifier _ "=" _ value:(String / ListDef / NodeDef / MultipleDef / Identifier) merge:(_ "&" _ Identifier)? {
	const ref = {
    type: "ref",
    	variableName: variableName,
        value,
    }
    if (merge) ref.merge = merge[3]
    return ref
}

NodeDef = nodeType:NodeType _ name:(AnyType/NodeName) _ "{" _  contents:(AttrValue / Identifiers / Identifier) _ "}" required:Required {
    switch (nodeType) {
       case "element": return {
       type: nodeType,
       name,
        contents,
        required,

       }
       case "attribute": return {
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

nonnsNodeName = name:$[a-zA-Z0-9]+ {
return { name }
}

AnyType = "*"

Identifiers = IdentifiersAndList / IdentifiersOrList

IdentifiersAndList = ids:(Identifier _ "&" _)+ lastId:Identifier {
	return [...ids.map(id => id[0]), lastId]
}

IdentifiersOrList = ids:(Identifier _ "|" _)+ lastId:Identifier {
	return [...ids.map(id => id[0]), lastId]
}

Identifier = id:(RegExp / Keyword / Variable) required:Required {
	id.required = required
	return id
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

RegExp = valueType:ValueType _ "{" _ "pattern" _ "=" _ String  _ "}" required:Required {
	return {
    	type: "regexp-pattern",
    }
}

Comment = "#" comment:$[^\n]+ {
	return null
}


ValueType = nsValueType / nonnsValueType

nsValueType = ns:$[a-zA-Z0-9]+ ":" valueType:nonnsValueType {
return { ...valueType, ns }
}

nonnsValueType = valueType:ValueTypeEnum {
return { valueType }
}

ValueTypeEnum = "string"

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
