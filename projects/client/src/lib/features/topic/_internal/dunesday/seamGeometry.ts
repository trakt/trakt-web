import { SEAM_LEAN } from './SEAM_LEAN.ts';

export function seamGeometry(width: number, height: number, fraction: number) {
  const middle = width * fraction;
  const xAt = (y: number) => middle - (y - height / 2) * SEAM_LEAN;
  return { xAt, top: xAt(0), bottom: xAt(height) };
}
