import type { VipCancelLoss } from '../models/VipCancelLoss.ts';

export type LossRowsProps = {
  losses: ReadonlyArray<VipCancelLoss>;
  endsAt: Date;
  isActive: boolean;
};
