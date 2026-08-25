import type { BaseItemProps } from '../models/BaseItemProps.ts';

export function resolveItemCardStyle(
  style: NonNullable<BaseItemProps['style']>,
  isLargeScreenCards: boolean,
): 'cover' | 'summary' {
  if (style === 'compact' || style === 'minimal') {
    return 'summary';
  }

  if (style === 'summary' && isLargeScreenCards) {
    return 'cover';
  }

  return style;
}
