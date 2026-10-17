import type { MixtapeSlot } from './MixtapeSlot.ts';

export type MixtapeFanPosterProps = {
  slot: MixtapeSlot;
  place: 'center' | 'start' | 'end';
  isSelected: boolean;
  isSwapping: boolean;
  isKept: boolean;
  canSwap: boolean;
  onSelect: () => void;
  onSwap: () => void;
};
