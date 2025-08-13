import { POPUP_POSITION_ATTRIBUTE } from './constants.ts';
import type { PopupPosition } from './models/PopupPlacement.ts';

export function setPositionAttributes(
  popupContainer: HTMLElement,
  targetNode: HTMLElement,
  position: PopupPosition | 'unaligned',
) {
  popupContainer.setAttribute(POPUP_POSITION_ATTRIBUTE, position);
  targetNode.setAttribute(POPUP_POSITION_ATTRIBUTE, position);
}
