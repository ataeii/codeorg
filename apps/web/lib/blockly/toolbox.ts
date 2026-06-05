export const FARSI_TOOLBOX = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "منطق",
      colour: "#5C81A6",
      contents: [
        { kind: "block", type: "controls_if" },
        { kind: "block", type: "logic_compare" },
        { kind: "block", type: "logic_operation" },
        { kind: "block", type: "logic_negate" },
        { kind: "block", type: "logic_boolean" },
      ],
    },
    {
      kind: "category",
      name: "حلقه‌ها",
      colour: "#5CA65C",
      contents: [
        { kind: "block", type: "controls_repeat_ext", inputs: { TIMES: { block: { type: "math_number", fields: { NUM: 10 } } } } },
        { kind: "block", type: "controls_whileUntil" },
        { kind: "block", type: "controls_for" },
        { kind: "block", type: "controls_forEach" },
        { kind: "block", type: "controls_flow_statements" },
      ],
    },
    {
      kind: "category",
      name: "ریاضی",
      colour: "#5C68A6",
      contents: [
        { kind: "block", type: "math_number" },
        { kind: "block", type: "math_arithmetic" },
        { kind: "block", type: "math_single" },
        { kind: "block", type: "math_random_int" },
      ],
    },
    {
      kind: "category",
      name: "متن",
      colour: "#5CA68D",
      contents: [
        { kind: "block", type: "text" },
        { kind: "block", type: "text_print" },
        { kind: "block", type: "text_join" },
        { kind: "block", type: "text_length" },
      ],
    },
    {
      kind: "category",
      name: "متغیرها",
      colour: "#A65C81",
      custom: "VARIABLE",
    },
    {
      kind: "category",
      name: "توابع",
      colour: "#9A5CA6",
      custom: "PROCEDURE",
    },
  ],
};
