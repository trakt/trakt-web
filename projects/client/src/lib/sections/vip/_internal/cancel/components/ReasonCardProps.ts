import type { VipCancelReason } from '../models/VipCancelReason.ts';

export type ReasonCardProps = {
  position: number;
  total: number;
  reason: VipCancelReason | Nil;
  onReason: (reason: VipCancelReason) => void;
  onContinue: () => void;
  onKeep: () => void;
};
