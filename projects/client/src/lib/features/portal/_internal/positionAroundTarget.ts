import type { PopupPlacement } from './models/PopupPlacement.ts';
import { resetPosition } from './resetPosition.ts';
import { setPositionAttributes } from './setPositionAttributes.ts';

type Viewport = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type TargetProps = {
  targetRect: DOMRect;
  targetNode: HTMLElement;
  placement: PopupPlacement;
  viewport: Viewport;
};

export function positionAroundTarget(
  node: HTMLElement,
  target: TargetProps,
) {
  const { targetRect, targetNode, placement, viewport } = target;
  const { position, mode } = placement;

  const offset = {
    left: mode === 'contain' ? targetRect.width : 0,
    top: mode === 'contain' ? targetRect.height : 0,
  };

  setPositionAttributes({ popupContainer: node, targetNode, position });
  resetPosition(node);

  const { left, top, right, bottom } = targetRect;
  const centerXOffset = (targetRect.width - node.offsetWidth) / 2;

  switch (position) {
    case 'right':
    case 'left':
      node.style.top = `${viewport.top + top}px`;
      break;

    case 'bottom':
    case 'top':
      node.style.left = `${viewport.left + left + centerXOffset}px`;
      break;
  }

  switch (position) {
    case 'right':
      node.style.left = `${viewport.left + right - offset.left}px`;
      break;
    case 'left':
      node.style.right = `${viewport.width - left - offset.left}px`;
      break;
    case 'bottom':
      node.style.top = `${viewport.top + bottom - offset.top}px`;
      break;
    case 'top':
      node.style.bottom = `${
        viewport.height - viewport.top - top - offset.top
      }px`;
      break;
  }
}
