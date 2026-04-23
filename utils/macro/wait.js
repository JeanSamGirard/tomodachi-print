// Return a macro that waits for 0.1s
// Currently this is required to prevent the game dropping inputs
// It does significantly slow down printing tho so if I find another solution that would be nice
export const macroWait = () => {
  return "0.5s\n";
};
