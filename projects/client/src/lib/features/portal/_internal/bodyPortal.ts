import { getTargetArea } from './getTargetArea.ts';
import type { PopupPlacement } from './models/PopupPlacement.ts';
import { positionAroundTarget } from './positionAroundTarget.ts';

export type PortalProps = {
  node: HTMLElement;
  targetRect: DOMRect;
  targetNode: HTMLElement;
  placement?: PopupPlacement;
};

export function bodyPortal(
  { node, targetRect, targetNode, placement }: PortalProps,
) {
  node.style.position = 'absolute';
  node.style.zIndex = 'var(--layer-menu)';

  const targetArea = getTargetArea();

  if (!placement) {
    node.style.left = `${targetArea.viewport.left + targetRect.left}px`;
    node.style.top = `${targetArea.viewport.top + targetRect.top}px`;
    targetArea.target.appendChild(node);
    return;
  }

  const target = {
    targetRect,
    targetNode,
    placement,
    viewport: targetArea.viewport,
  };

  positionAroundTarget(node, target);
  targetArea.target.appendChild(node);
}
