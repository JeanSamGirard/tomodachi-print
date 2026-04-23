import fs from "node:fs";
import { toTomodachiColor } from "./utils/toTomodachiColor.js";
import { macroPickColor } from "./utils/macro/pickColor.js";
import { macroMoveToAndDraw } from "./utils/macro/moveTo.js";
const fileName = process.argv[2];

if (!fileName) {
  console.error("Please provide a JSON file path.");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(fileName, "utf8"));

// Initialize to black
let currentColor = { h: 0, s: 0, b: 0 };
let currentPosition = { x: 0, y: 0 };

let macro = "";

data.palette.forEach((color, i) => {
  const targetColor = toTomodachiColor(color);
  macro += macroPickColor(currentColor, targetColor);
  currentColor = targetColor;

  // Loop through all positions and find where that color is used
  data.pixels.forEach((row, x) => {
    row.forEach((pixel, y) => {
      if (pixel === i) macro += macroMoveToAndDraw(currentPosition, { x, y });
      currentPosition = { x, y };
    });
  });
});

fs.writeFileSync("macro.txt", macro);
