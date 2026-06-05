import type * as BlocklyType from "blockly";
import type { JavascriptGenerator } from "blockly/javascript";

export function registerMazeBlocks(Blockly: typeof BlocklyType) {
  Blockly.Blocks["maze_move_forward"] = {
    init(this: BlocklyType.Block) {
      this.appendDummyInput().appendField("🚶 حرکت به جلو");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
    },
  };

  Blockly.Blocks["maze_turn_left"] = {
    init(this: BlocklyType.Block) {
      this.appendDummyInput().appendField("↰ چرخش به چپ");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(200);
    },
  };

  Blockly.Blocks["maze_turn_right"] = {
    init(this: BlocklyType.Block) {
      this.appendDummyInput().appendField("↱ چرخش به راست");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(200);
    },
  };
}

export function registerMazeGenerators(gen: JavascriptGenerator) {
  (gen as unknown as { forBlock: Record<string, () => string> }).forBlock["maze_move_forward"] = () => "maze_moveForward();\n";
  (gen as unknown as { forBlock: Record<string, () => string> }).forBlock["maze_turn_left"] = () => "maze_turnLeft();\n";
  (gen as unknown as { forBlock: Record<string, () => string> }).forBlock["maze_turn_right"] = () => "maze_turnRight();\n";
}
