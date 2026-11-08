import type { BrandingBackdrop } from '../../models/BrandingBackdrop.ts';
import type { BrandColor } from './BrandColor.ts';
import { brandColors } from './brandColors.ts';

const BACKDROP_COLOR: Record<BrandingBackdrop, BrandColor['key'] | null> = {
  light: 'white',
  dark: 'ink',
  brand: 'violet',
  transparent: null,
};

export function toLogoBackground(backdrop: BrandingBackdrop) {
  const key = BACKDROP_COLOR[backdrop];

  return brandColors.find((color) => color.key === key)?.hex;
}
