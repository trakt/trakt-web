import type { MixtapeSlot } from './MixtapeSlot.ts';

export type MixtapeSwipeCardProps = {
  slot: MixtapeSlot;
  dx: number;
  leaving: 'left' | 'right' | null;
  isDragging: boolean;
  isFlipped: boolean;
  isHinting: boolean;
};
