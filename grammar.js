/**
 * @file Language bara tree-sitter
 * @author SeungWuk Eun <seungwuk98@snu.ac.kr>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "bara",

  extras: $ => [
    $.comment,
    /[\ \v\t\f\r\n]/,
  ],

  rules: {
    source_file: $ => $.program,

    program: $ => repeat1($._statement),

    typeDeclaration: $ => seq(
      'struct',
      field("name", $.identifier),
      '(',
      optional($._typeParameter),
      ')',
      ';'
    ),

    _typeParameter: $ => seq(
      field('field', $.identifier),
      repeat(seq(',', field('field', $.identifier))),
    ),

    _statement: $ => choice(
      $.expressionStatement,
      $.ifStatement,
      $.whileStatement,
      $.doWhileStatement,
      $.forStatement,
      $.breakStatement,
      $.continueStatement,
      $.returnStatement,
      $.declarationStatement,
      $.functionDeclaration,
    ),


    _compoundStatement: $ => seq("{", repeat($._statement), "}"),

    expressionStatement: $ => seq($._expression, ";"),

    ifStatement: $ => seq(
      "if",
      $._expression,
      $._compoundStatement,
      optional(seq(
        "else", choice(
          $._compoundStatement,
          $.ifStatement
        )
      )),
    ),

    whileStatement: $ => seq(
      "while",
      $._expression,
      $._compoundStatement,
    ),

    doWhileStatement: $ => seq(
      "do",
      $._compoundStatement,
      "while",
      $._expression,
      ";",
    ),

    forStatement: $ => seq(
      "for",
      "(",
      optional($._declaration), ';',
      optional($._expression), ';',
      optional($._expression),
      ")",
      $._compoundStatement,
    ),

    breakStatement: _ => seq("break", ";"),

    continueStatement: _ => seq("continue", ";"),

    returnStatement: $ => seq("return", optional($._expression), ";"),

    _declaration: $ => seq(
      'var', $.pattern, optional(seq('=', $._expression)),
    ),

    _assignment: $ => seq(
      $._expression, '=', $._expression,
    ),

    declarationStatement: $ => seq(
      $._declaration, ";",
    ),

    functionDeclaration: $ => seq(
      'fn',
      field("name", $.identifier),
      '(', optional($.parameters), ')', '{', repeat($._statement), '}',
    ),

    parameters: $ => seq(
      $.identifier, repeat(seq(',', $.identifier)),
    ),

    _expression: $ => choice(
      $.matchExpression,
      $.lambdaExpression,
      $.binaryExpression,
      $.unaryExpression,
      $.conditionalExpression,
      $.callExpression,
      $.arrayExpression,
      $.indexExpression,
      $.identifierExpression,
      $.tupleExpression,
      $.groupExpression,
      $.integerLiteral,
      $.booleanLiteral,
      $.floatLiteral,
      $.stringLiteral,
      $.nilLiteral,
      $.compoundExpression,
      $.structAccessExpression,
    ),

    matchExpression: $ => seq(
      "match", $._expression, "{", repeat($.matchCase), "}"
    ),

    matchCase: $ => seq(
      $.pattern, '=>', $._expression, ';'
    ),

    lambdaExpression: $ => prec(-1, seq(
      '\\', optional($.parameters), '=>', $._expression,
    )),

    binaryExpression: $ => choice(
      //{Mul, 3},    {Div, 3},     {Mod, 3},    {Add, 4},    {Sub, 4},
      //{BitShl, 5}, {BitShr, 5},  {Lt, 6},     {Le, 6},     {Gt, 6},
      //{Ge, 6},     {Eq, 7},      {Ne, 7},     {BitAnd, 8}, {BitXor, 9},
      //{BitOr, 10}, {LogAnd, 11}, {LogOr, 12},
      prec.left(1, seq($._expression, "=", $._expression)),
      prec.left(1, seq($._expression, '+=', $._expression)),
      prec.left(1, seq($._expression, '-=', $._expression)),
      prec.left(1, seq($._expression, '*=', $._expression)),
      prec.left(1, seq($._expression, '/=', $._expression)),
      prec.left(1, seq($._expression, '%=', $._expression)),
      prec.left(1, seq($._expression, '&=', $._expression)),
      prec.left(1, seq($._expression, '|=', $._expression)),
      prec.left(1, seq($._expression, '^=', $._expression)),
      prec.left(1, seq($._expression, '<<=', $._expression)),
      prec.left(1, seq($._expression, '>>=', $._expression)),

      prec.left(2, seq($._expression, "||", $._expression)),
      prec.left(3, seq($._expression, "&&", $._expression)),
      prec.left(4, seq($._expression, "|", $._expression)),
      prec.left(5, seq($._expression, "^", $._expression)),
      prec.left(6, seq($._expression, "&", $._expression)),
      prec.left(7, seq($._expression, "==", $._expression)),
      prec.left(7, seq($._expression, "!=", $._expression)),
      prec.left(8, seq($._expression, "<", $._expression)),
      prec.left(8, seq($._expression, "<=", $._expression)),
      prec.left(8, seq($._expression, ">", $._expression)),
      prec.left(8, seq($._expression, ">=", $._expression)),
      prec.left(9, seq($._expression, "<<", $._expression)),
      prec.left(9, seq($._expression, ">>", $._expression)),
      prec.left(10, seq($._expression, "+", $._expression)),
      prec.left(10, seq($._expression, "-", $._expression)),
      prec.left(11, seq($._expression, "*", $._expression)),
      prec.left(11, seq($._expression, "/", $._expression)),
      prec.left(11, seq($._expression, "%", $._expression)),
    ),

    unaryExpression: $ => choice(
      prec.left(10, seq("!", $._expression)),
      prec.left(10, seq("~", $._expression)),
      prec.left(10, seq("-", $._expression)),
      prec.left(10, seq("+", $._expression)),
    ),

    conditionalExpression: $ => prec.right(1, seq(
      $._expression, '?', $._expression, ':', $._expression,
    )),

    callExpression: $ => prec.left(12, seq(
      field("callee", $._expression),
      '(', optional($._arguments), ')',
    )),

    _arguments: $ => seq(
      $._expression, repeat(seq(',', $._expression)),
    ),

    arrayExpression: $ => seq(
      '[',
      optional(seq(
        $._expression, repeat(seq(',', $._expression))
      )),
      optional(','),
      ']',
    ),

    indexExpression: $ => seq(
      $._expression, '[', $._expression, ']',
    ),

    identifierExpression: $ => $.identifier,

    tupleExpression: $ => seq(choice(
      seq('(', $._expression, ',', ')'),
      seq('(', $._expression, repeat1(seq(',', $._expression)), optional(','), ')'),
      seq('(', optional(','), ')')
    )),

    groupExpression: $ => seq('(', $._expression, ')'),

    compoundExpression: $ => seq(
      '{',
      repeat($._statement),
      optional($._expression),
      '}'
    ),

    structAccessExpression: $ => prec.left(12, seq(
      $._expression, '.', $.identifier
    )),

    integerLiteral: $ => $.integer,

    booleanLiteral: _ => choice("true", "false"),

    floatLiteral: $ => $.float,

    stringLiteral: $ => $.string,

    nilLiteral: _ => "nil",

    identifier: _ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    integer: _ => /\d+/,

    float: _ => /\d+\.\d*/,

    string: _ => token(seq(
      '"',
      repeat(choice(
        token.immediate(prec(1, /[^"\\]+/)),
        token.immediate(/\\./)
      )),
      '"'
    )),

    comment: $ => seq(
      /\/\/+/,
      optional($.litSupport),
      $._comment,
    ),

    litSupport: _ => token(prec(2, /[a-zA-Z][a-zA-Z0-9_-]+:/)),

    _comment: _ => token(prec(1, /.*/)),

    pattern: $ => choice(
      $.identifierPattern,
      $.integerPattern,
      $.floatPattern,
      $.stringPattern,
      $.booleanPattern,
      $.tuplePattern,
      $.nilPattern,
    ),

    identifierPattern: $ => $.identifier,

    stringPattern: $ => $.string,

    integerPattern: $ => $.integer,

    floatPattern: $ => $.float,

    booleanPattern: _ => choice("true", "false"),

    tuplePattern: $ => choice(
      seq('(', $.pattern, ',', ')'),
      seq('(', $.pattern, repeat1(seq(',', $.pattern)), optional(','), ')'),
      seq('(', optional(','), ')')
    ),

    structPattern: $ => seq(
      $.identifier,
      '(',
      repeat($._structPatternField),
      ')'
    ),

    _structPatternField: $ => seq(
      field("name", $.identifier),
      optional(seq(
        ':', $.pattern,
      ))
    ),

    nilPattern: _ => "nil",
  }
});
