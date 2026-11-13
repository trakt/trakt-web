import type { MixtapeSlot } from './MixtapeSlot.ts';

export type MixtapeStageCardProps = {
  slot: MixtapeSlot;
  offset: number;
  isSelected: boolean;
  isSwapping: boolean;
  isKept: boolean;
  canSwap: boolean;
  onSelect: () => void;
  onSwap: () => void;
};
