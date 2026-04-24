// Return a macro loop
export const macroLoop = (repeat, macros) => {
  if (Math.abs(repeat) === 1) return macros.join("");
  return "LOOP " + Math.abs(repeat) + "\n\t" + macros.join("\t");
};
