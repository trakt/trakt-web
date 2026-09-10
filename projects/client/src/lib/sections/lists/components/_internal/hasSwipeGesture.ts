import type { BaseItemProps } from '../models/BaseItemProps.ts';

type HasSwipeGestureProps = {
  style: BaseItemProps['style'];
  isLargeScreenCards: boolean;
  isMouse: boolean;
};

export function hasSwipeGesture(
  { style, isLargeScreenCards, isMouse }: HasSwipeGestureProps,
) {
  return style === 'summary' && !(isLargeScreenCards && isMouse);
}
