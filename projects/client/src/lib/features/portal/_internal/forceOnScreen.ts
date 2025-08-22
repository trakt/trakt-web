import type { PopupPosition } from './models/PopupPlacement.ts';
import { setPositionAttributes } from './setPositionAttributes.ts';

export function forceOnScreen(
  popupContainer: HTMLElement,
  targetNode: HTMLElement,
  position: PopupPosition,
) {
  const popupRect = popupContainer.getBoundingClientRect();

  const isLeftOverflow = popupRect.left < 0;
  const isRightOverflow = popupRect.right > globalThis.window.innerWidth;

  const hasOverflow = isLeftOverflow || isRightOverflow;
  if (!hasOverflow) {
    return;
  }

  setPositionAttributes({
    popupContainer,
    targetNode,
    position,
    alignment: 'unaligned',
  });

  if (isLeftOverflow) {
    const correction = 0 - popupRect.left;
    popupContainer.style.setProperty(
      '--alignment-correction',
      `${correction}px`,
    );
    popupContainer.style.right = 'initial';
    popupContainer.style.left = '0px';
    return;
  }

  const unalignedLeft = globalThis.window.innerWidth - popupRect.width;
  popupContainer.style.right = 'initial';
  popupContainer.style.left = `${unalignedLeft}px`;
  const correction = unalignedLeft - popupRect.left;
  popupContainer.style.setProperty(
    '--alignment-correction',
    `${correction}px`,
  );
}
