import fs from "node:fs";
import { toTomodachiColor } from "./utils/toTomodachiColor.js";
import { macroPickColor } from "./utils/macro/pickColor.js";
import { macroMoveToAndDraw } from "./utils/macro/moveTo.js";
import { findClosestPoint } from "./utils/findClosestInGrid.js";
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
  const targetColor = toTomodachiColor(color, currentColor);
  macro += macroPickColor(currentColor, targetColor);
  currentColor = targetColor;

  let targetPosition = findClosestPoint(data.pixels, currentPosition, i);
  while (targetPosition) {
    macro += macroMoveToAndDraw(currentPosition, targetPosition);
    currentPosition = targetPosition;
    data.pixels[currentPosition.y][currentPosition.x] = null;

    targetPosition = findClosestPoint(data.pixels, currentPosition, i);
  }
});

fs.writeFileSync("macro.txt", macro);
