import { Grammer, parse } from './parser';

const grammers = parse(`
default namespace = "http://www.w3.org/1999/xhtml"
# #####################################################################
##  RELAX NG Schema for HTML 5                                       #
# #####################################################################

  # To validate an HTML 5 document, you must first validate against  #
  # this schema and then ALSO validate against assertions.sch        #

  ## HTML flavor RELAX NG schemas can only be used after the         #
  ## document has been transformed to well-formed XML.               #
  ##   - Insert closing slashes in all empty element tags            #
  ##   - Insert all optional start and end tags                      #
  ##   - Add xmlns "http://www.w3.org/1999/xhtml"                    #
  ##   - Properly escape <script> and <style> CDATA                  #
  ##   - Parse and transform all HTML-only entities to numeric       #
  ##     character references                                        #
  ## Obviously, syntax-checking involving these features cannot be   #
  ## done by the RELAX NG schema and must be checked, along with the #
  ## <!DOCTYPE> requirement, by some other application.              #

# #####################################################################
## Schema Framework & Parameters

include "common.rnc" {
	# XHTML flavor #
		XMLonly = notAllowed
		HTMLonly = empty
	# HTML 4 compat #
		v5only = empty
	# HTML-serializability #
		nonHTMLizable = notAllowed
	# HTML-roundtrippability #
		nonRoundtrippable = notAllowed
}

# #####################################################################
## Language Definitions

start = html.elem

include "meta.rnc"
`);

const variables: Grammer[] = [];

for (const grammer of grammers) {
	switch (grammer.type) {
		case 'ref': {
			variables.push(grammer);
		}
	}
}

// console.log(variables);
