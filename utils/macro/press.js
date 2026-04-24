import { macroWait } from "./wait.js";

// Return a macro that press a button
export const macroPress = (button, duration = "0.08s") => {
  return button + " " + duration + "\n";
};
