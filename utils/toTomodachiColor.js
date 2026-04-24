// Tomodachi life color space
// H = 0 - 201 (Inverted from regular HSB)
// S = 0 - 211
// B = 0 - 110

export const toTomodachiColor = (hexColor, currentColor) => {
  const r = parseInt(hexColor.substring(1, 3), 16) / 255;
  const g = parseInt(hexColor.substring(3, 5), 16) / 255;
  const b = parseInt(hexColor.substring(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let hStd = 0;
  if (delta !== 0) {
    if (max === r) {
      hStd = ((g - b) / delta) % 6;
    } else if (max === g) {
      hStd = (b - r) / delta + 2;
    } else {
      hStd = (r - g) / delta + 4;
    }
    hStd = hStd * 60;
    if (hStd < 0) hStd += 360;
  }

  const sStd = max === 0 ? 0 : delta / max;
  const bStd = max;

  const targetColor = {
    h: Math.round(201 - hStd * (201 / 360)),
    s: Math.round(sStd * 211),
    b: Math.round(bStd * 110),
    hex: hexColor,
    usage: performance.now(),
  };

  // Changing hue is useless if saturation or brightness is 0
  if (targetColor.s === 0 || targetColor.b === 0) {
    targetColor.h = currentColor.h;
  }

  if (targetColor.b === 0) {
    targetColor.s = currentColor.s;
  }

  return targetColor;
};

export const formatTomoColor = (color) => {
  return `h${color.h}|s${color.s}|b${color.b}`;
};
