import type { VipGateway } from '$lib/requests/models/VipGateway.ts';
import type { VipDealPlan } from '../../models/VipDealPlan.ts';
import type { VipCancelLimit } from './VipCancelLimit.ts';
import type { VipCancelLoss } from './VipCancelLoss.ts';
import type { VipRetentionOffer } from './VipRetentionOffer.ts';

export type VipCancelSummary = Readonly<{
  endsAt: Date;
  vipMonths: number;
  gateway: VipGateway | null;
  manageUrl: string | null;
  offer: VipRetentionOffer | null;
  switchPlan: VipDealPlan | null;
  stats: {
    plays: number;
    hours: number;
    ratings: number;
  };
  losses: ReadonlyArray<VipCancelLoss>;
  library: ReadonlyArray<VipCancelLimit>;
}>;
