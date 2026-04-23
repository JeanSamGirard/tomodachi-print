import { macroWait } from "./wait.js";

// Return a macro that press a button
export const macroPress = (button, duration = "0.1s") => {
  return button + " " + duration + "\n";
};
