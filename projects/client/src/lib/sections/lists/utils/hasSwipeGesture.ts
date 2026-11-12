import type { BaseItemProps } from '../components/models/BaseItemProps.ts';

type HasSwipeGestureProps = {
  style: BaseItemProps['style'];
  isLargeScreenCards: boolean;
};

export function hasSwipeGesture({
  style,
  isLargeScreenCards,
}: HasSwipeGestureProps) {
  return style === 'summary' && !isLargeScreenCards;
}
