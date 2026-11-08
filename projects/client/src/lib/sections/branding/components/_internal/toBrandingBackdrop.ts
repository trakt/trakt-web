import type { BrandingBackdrop } from '../../models/BrandingBackdrop.ts';

const BACKDROPS: ReadonlyArray<BrandingBackdrop> = [
  'light',
  'dark',
  'brand',
  'transparent',
];

export function toBrandingBackdrop(value: string | null): BrandingBackdrop {
  return BACKDROPS.find((backdrop) => backdrop === value) ?? 'light';
}
