import type { VipGateway } from '$lib/requests/models/VipGateway.ts';
import type { VipCancelLimit } from './VipCancelLimit.ts';
import type { VipCancelLoss } from './VipCancelLoss.ts';
import type { VipRetentionOffer } from './VipRetentionOffer.ts';

export type VipCancelSummary = {
  endsAt: Date;
  vipMonths: number;
  gateway: VipGateway | null;
  manageUrl: string | null;
  offer: VipRetentionOffer | null;
  stats: {
    plays: number;
    hours: number;
    ratings: number;
  };
  losses: ReadonlyArray<VipCancelLoss>;
  library: ReadonlyArray<VipCancelLimit>;
};
