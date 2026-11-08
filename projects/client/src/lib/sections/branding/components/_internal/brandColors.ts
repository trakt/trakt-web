import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { oklchToHex } from '$lib/utils/color/oklchToHex.ts';
import type { BrandColor } from './BrandColor.ts';

const VIOLET_TOKEN = {
  name: '--color-brand-violet',
  value: 'oklch(49.0% 0.217 289)',
};

export const brandColors: ReadonlyArray<BrandColor> = [
  {
    key: 'violet',
    hex: assertDefined(
      oklchToHex(VIOLET_TOKEN.value),
      'Expected the brand violet token to be a valid oklch color',
    ),
    token: VIOLET_TOKEN,
  },
  { key: 'white', hex: '#FFFFFF' },
  { key: 'ink', hex: '#111111' },
];
