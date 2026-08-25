import { mediaCardWidthResolver } from './mediaCardWidthResolver.ts';

export function drilldownGrid(
  isLargeScreenCards: boolean,
  variant: 'portrait' | 'landscape' = 'portrait',
) {
  if (!isLargeScreenCards) {
    return { sizing: 'auto', itemWidth: 'var(--width-summary-card)' } as const;
  }

  return {
    sizing: 'cover',
    itemWidth: mediaCardWidthResolver(variant),
  } as const;
}
