import type { Rgb } from '../models/Rgb.ts';

const BINS = 32;
const DEFAULT_COLOR: Rgb = [255, 140, 60];
const WHITE: Rgb = [255, 255, 255];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const mixRgb = (from: Rgb, to: Rgb, amount: number): Rgb => [
  from[0] + (to[0] - from[0]) * amount,
  from[1] + (to[1] - from[1]) * amount,
  from[2] + (to[2] - from[2]) * amount,
];

const scaleRgb = (color: Rgb, factor: number): Rgb => [
  color[0] * factor,
  color[1] * factor,
  color[2] * factor,
];

function hexToRgb(hex: string): Rgb {
  const digits = hex.slice(1);
  const full =
    digits.length <= 4
      ? digits
          .split('')
          .map((digit) => digit + digit)
          .join('')
      : digits;

  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ];
}

function isWarm([red, green, blue]: Rgb) {
  const max = Math.max(red, green, blue);
  const spread = max - Math.min(red, green, blue);
  if (max === 0 || spread === 0) return false;

  const sector =
    max === red
      ? ((green - blue) / spread) % 6
      : max === green
        ? (blue - red) / spread + 2
        : (red - green) / spread + 4;
  const hue = (sector * 60 + 360) % 360;

  return spread / max > 0.25 && (hue < 60 || hue > 330);
}

function kelvinRgb(kelvin: number): Rgb {
  const t = kelvin / 100;
  const red = t <= 66 ? 255 : 329.698727446 * (t - 60) ** -0.1332047592;
  const green =
    t <= 66
      ? 99.4708025861 * Math.log(t) - 161.1195681661
      : 288.1221695283 * (t - 60) ** -0.0755148492;
  const blue =
    t >= 66
      ? 255
      : t <= 19
        ? 0
        : 138.5177312231 * Math.log(t - 10) - 305.0447927307;

  return [clamp(red, 0, 255), clamp(green, 0, 255), clamp(blue, 0, 255)];
}

function binColor({
  base,
  isWarmBase,
  heat,
}: {
  base: Rgb;
  isWarmBase: boolean;
  heat: number;
}): Rgb {
  if (isWarmBase) {
    return scaleRgb(
      kelvinRgb(850 + 3150 * heat ** 1.25),
      0.3 + 0.7 * heat ** 0.7,
    );
  }

  return heat < 0.62
    ? mixRgb(scaleRgb(base, 0.28), base, heat / 0.62)
    : mixRgb(base, WHITE, ((heat - 0.62) / 0.38) * 0.85);
}

export function emberPalette(color: string | null) {
  const base = color ? hexToRgb(color) : DEFAULT_COLOR;
  const isWarmBase = isWarm(base);
  const bins = Array.from({ length: BINS + 1 }, (_, index) =>
    binColor({ base, isWarmBase, heat: index / BINS }),
  );

  return (heat: number): Rgb =>
    bins[Math.round(clamp(heat, 0, 1) * BINS)] ?? base;
}
