type RGB = { r: number; g: number; b: number };

function hexToRgb(hex: string): RGB | null {
  const cleaned = hex.replace('#', '');
  if (cleaned.length !== 6) return null;
  return {
    r: parseInt(cleaned.slice(0, 2), 16),
    g: parseInt(cleaned.slice(2, 4), 16),
    b: parseInt(cleaned.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: RGB): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Blend two hex colors. `weight` is the proportion of `color` (0–1).
 * Equivalent to `color-mix(in srgb, base (1-weight)*100%, color weight*100%)`.
 */
export function blendColors(
  base: string,
  color: string,
  weight: number,
): string {
  const baseRgb = hexToRgb(base);
  const colorRgb = hexToRgb(color);

  if (!baseRgb || !colorRgb) return base;

  return rgbToHex({
    r: Math.round(baseRgb.r + (colorRgb.r - baseRgb.r) * weight),
    g: Math.round(baseRgb.g + (colorRgb.g - baseRgb.g) * weight),
    b: Math.round(baseRgb.b + (colorRgb.b - baseRgb.b) * weight),
  });
}
