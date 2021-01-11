module.exports = grammar({
  name: "json",

  extras: () => [/\s/],

  supertypes: ($) => [$._value],

  rules: {
    document: ($) => choice($.rootObject, $._value),

    _value: ($) =>
      choice(
        $.comment,
        $.object,
        $.array,
        $.number,
        $.string,
        $.true,
        $.false,
        $.null
      ),

    rootObject: ($) => seq(commaSep1($.pair)),
    comment: () => token(/\/\/.*\n/),

    object: ($) => seq("{", commaSep($.pair), optional(","), "}"),

    pair: ($) =>
      seq(
        field("key", choice($.string, $.number)),
        ":",
        field("value", $._value)
      ),

    array: ($) => seq("[", commaSep($._value), optional(","), "]"),

    string: ($) => {
      const without = choice(seq("'", "'"), seq('"', '"'));
      const str_double = seq("'", $.string_content, "'");
      const str_single = seq('"', $.string_content, '"');
      return choice(
        without,
        $.identifier_string,
        choice(str_double, str_single)
      );
    },

    string_content: ($) =>
      repeat1(choice(token.immediate(/[^\\'\\"\n]+/), $.escape_sequence)),

    escape_sequence: () =>
      token.immediate(seq("\\", /(\'|\"|\\|\/|b|n|r|t|u)/)),

    number: () => {
      const hex_literal = seq(choice("0x", "0X"), /[\da-fA-F]+/);

      const decimal_digits = /[\d_]+/;
      const signed_integer = seq(optional(choice("-", "+")), decimal_digits);
      const exponent_part = seq(choice("e", "E"), signed_integer);

      const binary_literal = seq(choice("0b", "0B"), /[0-1]+/);

      const octal_literal = seq(choice("0o", "0O"), /[0-7]+/);

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

      return token(
        choice(hex_literal, decimal_literal, binary_literal, octal_literal)
      );
    },

    identifier_string: () => /[^:{},\[\]\s'"`]+/,

    true: () => "true",

    false: () => "false",

    null: () => "null",
  },
});

/*
 * seq(rule, repeat(seq(optional(","), rule)))
 * */
function commaSep1(rule) {
  return seq(rule, repeat(seq(optional(","), rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}
