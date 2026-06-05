export const MAZE_TOOLBOX = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "حرکت",
      colour: "#5BA55B",
      contents: [
        { kind: "block", type: "maze_move_forward" },
        { kind: "block", type: "maze_turn_left" },
        { kind: "block", type: "maze_turn_right" },
      ],
    },
    {
      kind: "category",
      name: "حلقه‌ها",
      colour: "#5CA65C",
      contents: [
        {
          kind: "block",
          type: "controls_repeat_ext",
          inputs: { TIMES: { block: { type: "math_number", fields: { NUM: 3 } } } },
        },
      ],
    },
  ],
};
