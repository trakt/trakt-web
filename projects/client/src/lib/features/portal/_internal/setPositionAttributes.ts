import {
  POPUP_ALIGNMENT_ATTRIBUTE,
  POPUP_POSITION_ATTRIBUTE,
} from './constants.ts';
import type { PopupPosition } from './models/PopupPlacement.ts';

type PositionProps = {
  popupContainer: HTMLElement;
  targetNode: HTMLElement;
  position: PopupPosition;
  alignment?: 'aligned' | 'unaligned';
};

export function setPositionAttributes({
  popupContainer,
  targetNode,
  position,
  alignment = 'aligned',
}: PositionProps) {
  popupContainer.setAttribute(POPUP_POSITION_ATTRIBUTE, position);
  targetNode.setAttribute(POPUP_POSITION_ATTRIBUTE, position);

  popupContainer.setAttribute(POPUP_ALIGNMENT_ATTRIBUTE, alignment);
  targetNode.setAttribute(POPUP_ALIGNMENT_ATTRIBUTE, alignment);
}
