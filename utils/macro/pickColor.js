import { BUTTONS } from "../../constants/buttons.js";
import { macroLoop } from "./loop.js";
import { macroPress } from "./press.js";
import { macroWait } from "./wait.js";

// Return a macro to open the color picker and move to the target color from the current color
export const macroPickColor = (current, target) => {
  // Open the color menu
  let macro =
    macroPress(BUTTONS.Y) + macroWait() + macroPress(BUTTONS.Y) + macroWait();

  // Pick the hue
  const hDiff = target.h - current.h;
  if (hDiff)
    macro += macroLoop(hDiff, [
      macroPress(hDiff > 0 ? BUTTONS.ZR : BUTTONS.ZL),
      macroWait(),
    ]);

  // Pick the saturation
  const sDiff = target.s - current.s;
  if (sDiff)
    macro += macroLoop(sDiff, [
      macroPress(sDiff > 0 ? BUTTONS.RIGHT : BUTTONS.LEFT),
      macroWait(),
    ]);

  // Pick the brightness
  const bDiff = target.b - current.b;
  if (bDiff)
    macro += macroLoop(bDiff, [
      macroPress(bDiff > 0 ? BUTTONS.UP : BUTTONS.DOWN),
      macroWait(),
    ]);

  // Select the color
  macro += macroPress(BUTTONS.A) + macroWait();

  return macro;
};
