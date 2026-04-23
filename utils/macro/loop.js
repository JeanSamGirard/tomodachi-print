// Return a macro loop
export const macroLoop = (repeat, macros) => {
  return "LOOP " + Math.abs(repeat) + "\n\t" + macros.join("\t");
};
