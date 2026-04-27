import fs from "node:fs";
import { formatColor } from "./utils/formatColor.js";
import { macroPickColor, macroSwitchColor } from "./utils/macro/pickColor.js";
import { macroMoveTo } from "./utils/macro/moveTo.js";
import { macroComment } from "./utils/macro/comment.js";
import { macroPress } from "./utils/macro/press.js";
import { BUTTONS } from "./constants/buttons.js";
import { macroWait } from "./utils/macro/wait.js";
import { readArgs } from "./utils/readArgs.js";
const fileName = process.argv[2];

if (!fileName) {
  console.error("Please provide a JSON file path.");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(fileName, "utf8"));

// Initialize the game default palette
const palette = [
  { press: { h: 0, s: 0, b: 0 }, hex: "#000000" },
  { press: { h: 0, s: 0, b: 110 }, hex: "#FFFFFF" },
  { press: { h: 181, s: 192, b: 63 }, hex: "#91610D" },
  { press: { h: 196, s: 211, b: 91 }, hex: "#D42700" },
  { press: { h: 184, s: 211, b: 107 }, hex: "#F78400" },
  { press: { h: 157, s: 192, b: 91 }, hex: "#92D314" },
  { press: { h: 130, s: 209, b: 65 }, hex: "#019616" },
  { press: { h: 80, s: 211, b: 83 }, hex: "#004AC0" },
  { press: { h: 54, s: 169, b: 84 }, hex: "#6527C2" },
];

let currentPaletteIndex = 0;
let currentPosition = { x: 0, y: 0 };

let macro = "";

const { skip } = readArgs(process.argv.slice(2));

data.pixels.forEach((row, y) => {
  if (row.every((pixel) => pixel === null) || y < skip) return;

  // Collect unique colors needed for this row in order of first appearance
  const uniqueColors = [];
  const colorLastX = {};
  row.forEach((pixel, x) => {
    if (pixel !== null) {
      const color = data.palette[pixel];
      colorLastX[color.hex] = x;
      if (!uniqueColors.includes(color)) uniqueColors.push(color);
    }
  });

  // Preload up to 9 colors not in palette, in order of appearance only replacing colors that are not used elsewhere on this row
  for (
    let i = 0, preloadCount = 0;
    i < uniqueColors.length && preloadCount < 9;
    i++
  ) {
    const color = uniqueColors[i];
    if (!palette.some((p) => p.hex === color)) {
      const targetToReplace = palette.findIndex(
        (v) => !uniqueColors.some((uc) => uc.hex === v.hex),
      );

      if (targetToReplace === -1) continue;
      preloadCount++;

      macro += macroComment(
        `Color preload Slot ${currentPaletteIndex} -> ${targetToReplace} : ${formatColor(palette[targetToReplace])} -> ${formatColor(color)}`,
        `${currentPosition.y}.${currentPosition.x}p-${targetToReplace}`,
      );

      macro += macroPickColor(
        currentPaletteIndex,
        targetToReplace,
        palette[targetToReplace],
        color,
      );

      palette[targetToReplace] = color;
      currentPaletteIndex = targetToReplace;
    }
  }

  macro += macroComment(
    "Start row",
    `${currentPosition.y}.${currentPosition.x}r`,
  );

  row.forEach((pixel, x) => {
    if (pixel !== null) {
      const color = data.palette[pixel];

      // Move to that pixel
      macro += macroMoveTo(currentPosition, { x, y });
      currentPosition = { x, y };

      // Select color
      const paletteIndex = palette.findIndex((v) => v.hex === color.hex);

      if (paletteIndex === -1) {
        // We don't have this color in our palette, pick it now
        const targetToReplace = palette.indexOf(
          palette.toSorted((a, b) => {
            function calculateValue(c) {
              // If we are pass the last x of that color prioritize it because we won't need it again for this row
              if (colorLastX[c.hex] < x) return -1;

              return (
                Math.abs(color.press.h - c.press.h) +
                Math.abs(color.press.s - c.press.s) +
                Math.abs(color.press.b - c.press.b)
              );
            }

            return calculateValue(a) - calculateValue(b);
          })[0],
        );

        macro += macroComment(
          `Color pick Slot ${currentPaletteIndex} -> ${targetToReplace} : ${formatColor(palette[targetToReplace])} -> ${formatColor(color)}`,
          `${y}.${x}c`,
        );

        macro += macroPickColor(
          currentPaletteIndex,
          targetToReplace,
          palette[targetToReplace],
          color,
        );

        palette[targetToReplace] = color;
        currentPaletteIndex = targetToReplace;
      } else if (paletteIndex !== currentPaletteIndex) {
        // We have this color in our palette but we need to change to it

        macro += macroComment(
          `Color switch Slot ${currentPaletteIndex} -> ${paletteIndex} : expecting color ${formatColor(palette[paletteIndex])}`,
          `${y}.${x}s`,
        );

        macro += macroSwitchColor(currentPaletteIndex, paletteIndex);
        currentPaletteIndex = paletteIndex;
      }

      macro += macroPress(BUTTONS.A) + macroWait();
    }
  });
});

fs.writeFileSync(fileName.replace(".json", ".txt"), macro);

// Calculate and display estimated total time
const totalTimeMs = calculateTotalTime(macro);
console.log(
  `Estimated total print time: ${(totalTimeMs / 60000).toFixed(2)} minutes`,
);

function calculateTotalTime(macroStr) {
  let time = 0;
  let loopMultiplier = 1;
  const lines = macroStr.split("\n");
  for (const line of lines) {
    if (line.startsWith("LOOP ")) {
      const n = parseInt(line.split(" ")[1]);
      loopMultiplier = n;
    } else if (line.trim() === "0.15s") {
      time += 150 * loopMultiplier;
    } else if (line.trim().endsWith(" 0.08s")) {
      time += 80 * loopMultiplier;
    } else if (!line.startsWith("\t") && loopMultiplier > 1) {
      // End of loop
      loopMultiplier = 1;
    }
  }
  return time;
}
