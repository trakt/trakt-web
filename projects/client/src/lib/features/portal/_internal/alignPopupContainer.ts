import type { PortalProps } from './bodyPortal.ts';
import { forceOnScreen } from './forceOnScreen.ts';
import { getOppositePosition } from './getOppositePosition.ts';
import { getTargetArea } from './getTargetArea.ts';
import { positionAroundTarget } from './positionAroundTarget.ts';

export function alignPopupContainer(
  { node, targetRect, targetNode, placement }: PortalProps,
) {
  if (!placement) {
    return;
  }

  const popupRect = node.getBoundingClientRect();
  const { viewport } = getTargetArea();
  const { position } = placement;

  const isOverflowed = (direction: 'horizontal' | 'vertical') =>
    direction === 'horizontal'
      ? popupRect.right > viewport.width || popupRect.left < 0
      : popupRect.bottom > viewport.height || popupRect.top < 0;

  const direction = position === 'left' || position === 'right'
    ? 'horizontal'
    : 'vertical';

  if (!isOverflowed(direction)) {
    forceOnScreen(node, targetNode, position);
    return;
  }

  const target = {
    targetRect,
    targetNode,
    placement: {
      ...placement,
      position: getOppositePosition(position),
    },
    viewport,
  };

  positionAroundTarget(node, target);
  forceOnScreen(node, targetNode, target.placement.position);
}
