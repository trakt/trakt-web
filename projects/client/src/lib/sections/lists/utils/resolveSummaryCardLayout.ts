import type { BaseItemProps } from '../components/models/BaseItemProps.ts';
import type { SummaryCardLayout } from '../components/models/SummaryCardLayout.ts';

type ResolveSummaryCardLayoutProps = {
  style: NonNullable<BaseItemProps['style']>;
  isLargeScreen: boolean;
};

export function resolveSummaryCardLayout({
  style,
  isLargeScreen,
}: ResolveSummaryCardLayoutProps): SummaryCardLayout {
  if (style === 'compact' || style === 'minimal') {
    return style;
  }

  return isLargeScreen ? 'large' : 'default';
}
