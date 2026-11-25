import type { Rgb } from '../models/Rgb.ts';

export function toRgba([red, green, blue]: Rgb, alpha: number) {
  return `rgba(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)}, ${alpha})`;
}
