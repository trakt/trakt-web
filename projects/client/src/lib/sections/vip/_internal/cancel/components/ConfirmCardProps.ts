import type { VipCancelSummary } from '../models/VipCancelSummary.ts';
import type { VipCancelReason } from '../models/VipCancelReason.ts';

export type ConfirmCardProps = {
  position: number;
  total: number;
  summary: VipCancelSummary;
  reason: VipCancelReason | Nil;
  onCancel: () => void;
  onKeep: () => void;
  onClaim: () => void;
  isBusy: boolean;
};
