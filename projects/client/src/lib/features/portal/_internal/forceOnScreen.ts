import { setPositionAttributes } from './setPositionAttributes.ts';

export function forceOnScreen(
  popupContainer: HTMLElement,
  targetNode: HTMLElement,
) {
  const popupRect = popupContainer.getBoundingClientRect();

  const isLeftOverflow = popupRect.left < 0;
  const isRightOverflow = popupRect.right > globalThis.window.innerWidth;

  const hasOverflow = isLeftOverflow || isRightOverflow;
  if (!hasOverflow) {
    return;
  }

  setPositionAttributes(popupContainer, targetNode, 'unaligned');

  if (isLeftOverflow) {
    popupContainer.style.right = 'initial';
    popupContainer.style.left = '0px';
    return;
  }

  const unalignedLeft = globalThis.window.innerWidth - popupRect.width;
  popupContainer.style.right = 'initial';
  popupContainer.style.left = `${unalignedLeft}px`;
}
