import type { PopupPosition } from './models/PopupPlacement.ts';

export function getOppositePosition(position: PopupPosition): PopupPosition {
  switch (position) {
    case 'top':
      return 'bottom';
    case 'bottom':
      return 'top';
    case 'left':
      return 'right';
    case 'right':
      return 'left';
  }
}
