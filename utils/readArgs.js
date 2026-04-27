export const readArgs = (args) => {
  const res = {};
  for (const arg of args) {
    const splitArg = arg.split("=");
    if (splitArg.length === 2) res[splitArg[0]] = splitArg[1];
  }
  return res;
};
