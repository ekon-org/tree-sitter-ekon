const PREC = {
  COMMENT: 1,
  NUMBER: 2,
  NULL: 2,
  TRUE: 2,
  FALSE: 2,
  STRING: 1,
};

module.exports = grammar({
  name: "json",

  extras: ($) => [/\s/, $.comment],

  supertypes: ($) => [$._value],

  rules: {
    document: ($) =>
      seq(optional($.schema), choice(alias($.rootObject, $.object), $._value)),

    _value: ($) =>
      choice($.object, $.array, $.number, $.string, $.true, $.false, $.null),

    rootObject: ($) => seq(commaSep1($.pair)),

    comment: () => token(/\/\/.*\n/),

    object: ($) => seq("{", commaSep($.pair), optional(","), "}"),

    pair: ($) => seq(field("key", $.string), ":", field("value", $._value)),

    array: ($) => seq("[", commaSep($._value), optional(","), "]"),

    number: () => {
      const hex_literal = seq(
        choice("0x", "0X"),
        /[\da-fA-F][\da-fA-F_]*[\da-fA-F]/
      );

      const decimal_digits = /[\d_]+/;

      const signed_integer = seq(optional(choice("-", "+")), decimal_digits);

      const exponent_part = seq(choice("e", "E"), signed_integer);

      const binary_literal = seq(choice("0b", "0B"), /[01][01_]*[01]/);

      const octal_literal = seq(choice("0o", "0O"), /[0-7][0-7_]*[0-7]/);

      const decimal_integer_literal = seq(
        optional(choice("-", "+")),
        choice("0", seq(/[1-9]/, optional(decimal_digits), optional(/\d/)))
      );

      const decimal_literal = choice(
        seq(
          decimal_integer_literal,
          ".",
          optional(decimal_digits),
          optional(exponent_part)
        ),
        seq(".", decimal_digits, optional(exponent_part)),
        seq(decimal_integer_literal, optional(exponent_part))
      );

      return prec(
        PREC.NUMBER,
        token(
          choice(hex_literal, decimal_literal, binary_literal, octal_literal)
        )
      );
    },

    string: ($) => {
      const without = choice(seq("'", "'"), seq('"', '"'));
      const str_double = seq("'", $._string_content, "'");
      const str_single = seq('"', $._string_content, '"');
      const identifier_string = /[^:{},\[\]\s'"`]+/;
      return prec(
        PREC.STRING,
        choice(without, identifier_string, choice(str_double, str_single))
      );
    },

    _string_content: ($) =>
      repeat1(choice(token.immediate(/[^\\'\\"]+/), $._escape_sequence)),

    _escape_sequence: () =>
      token.immediate(seq("\\", /(\'|\"|\\|\/|b|n|r|t|u)/)),

    true: () => "true",

    false: () => "false",

    null: () => "null",

    schema: ($) => seq("`", /[^`]*/, "`"),
  },
});

/* seq(rule, repeat(seq(optional(","), rule))) */
function commaSep1(rule) {
  return seq(rule, repeat(seq(optional(","), rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}
