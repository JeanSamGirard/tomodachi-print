// Tomodachi life color space
// H = 0 - 200 (Inverted from regular HSB)
// S = 0 - 212
// B = 0 - 111

export const toTomodachiColor = (hexColor) => {
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

  return {
    h: Math.round(200 - hStd * (200 / 360)),
    s: Math.round(sStd * 212),
    b: Math.round(bStd * 111),
  };
};
