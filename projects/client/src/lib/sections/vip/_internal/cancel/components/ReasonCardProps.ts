import type { VipCancelReason } from '../models/VipCancelReason.ts';

export type ReasonCardProps = {
  position: number;
  total: number;
  reason: VipCancelReason | Nil;
  details: string;
  onReason: (reason: VipCancelReason) => void;
  onDetails: (details: string) => void;
  onContinue: () => void;
  onKeep: () => void;
};
