import { BUTTONS } from "../../constants/buttons.js";
import { macroLoop } from "./loop.js";
import { macroPress } from "./press.js";
import { macroWait } from "./wait.js";

// Return a macro to move the cursor to the target position from the current position
export const macroMoveToAndDraw = (current, target) => {
  let macro = "";

  // Move X
  const xDiff = target.x - current.x;
  if (xDiff)
    macro += macroLoop(xDiff, [
      macroPress(xDiff > 0 ? BUTTONS.RIGHT : BUTTONS.LEFT),
      macroWait(),
    ]);

  // Move Y
  const yDiff = target.y - current.y;
  if (yDiff)
    macro += macroLoop(yDiff, [
      macroPress(yDiff > 0 ? BUTTONS.DOWN : BUTTONS.UP),
      macroWait(),
    ]);

  macro += macroPress(BUTTONS.A) + macroWait();

  return macro;
};
