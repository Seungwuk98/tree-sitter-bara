[
  "fn"
  "var"
  "for"
  "while"
  "if"
  "else"
  "break"
  "continue"
  "match"
  "return"
  "do"
  "struct"
] @keyword

(integer) @number
(float) @number
"true" @constant.builtin
"false" @constant.builtin
"nil" @constant.builtin

(string) @string

[
  "="
  "+"
  "-"
  "*"
  "/"
  "%"
  "<"
  ">"
  "<="
  ">="
  "=="
  "!="
  "&&"
  "||"
  "!"
  "^"
  "&"
  "|"
  "<<"
  ">>"
  "+="
  "-="
  "*="
  "/="
  "%="
  "&="
  "|="
  "^="
  "<<="
  ">>="
  "\\"
  "=>"
  "?"
  ":"
  "."
] @operator

[
  "("
  ")"
  "[" 
  "]"
  "{"
  "}"
] @punctuation.bracket

["," ";"] @punctuation.delimiter

(litSupport) @attribute

(comment) @comment 

(callExpression
  callee: (identifierExpression 
    (
      (identifier) @function-name
        (#any-of? @function-name 
                  "print"
                  "help"
                  "push"
                  "pop"
                  "str"
                  "format"
                  "len"
                  "int"
                  "float"
                  "bool"
                  "type"
                  "input"
                  "split"
        )
    ) @function.builtin
  )
)

(callExpression 
  callee: (identifierExpression) @function)

(structAccessExpression
  field: (identifier) @property)

(functionDeclaration
  name: (identifier) @function)

(typeDeclaration
  name: (identifier) @type
  field: (identifier) @variable.parameter)

(structPattern
  name: (identifier) @type
  field: (identifier) @variable.parameter)

(parameters
  (identifier) @variable.parameter)




