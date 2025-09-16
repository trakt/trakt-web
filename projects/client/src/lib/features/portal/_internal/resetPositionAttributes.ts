import {
  POPUP_ALIGNMENT_ATTRIBUTE,
  POPUP_POSITION_ATTRIBUTE,
} from './constants.ts';

export function resetPositionAttributes(targetNode: HTMLElement) {
  targetNode.removeAttribute(POPUP_POSITION_ATTRIBUTE);
  targetNode.removeAttribute(POPUP_ALIGNMENT_ATTRIBUTE);
}
