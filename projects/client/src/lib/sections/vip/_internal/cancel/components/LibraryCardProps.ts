import type { VipCancelSummary } from '../models/VipCancelSummary.ts';

export type LibraryCardProps = {
  position: number;
  total: number;
  summary: VipCancelSummary;
  onContinue: () => void;
  onKeep: () => void;
};
