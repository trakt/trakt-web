import type { VipCancelReason } from '../models/VipCancelReason.ts';
import type { VipRetentionOffer } from '../models/VipRetentionOffer.ts';

export type OfferCouponProps = {
  offer: VipRetentionOffer;
  reason: VipCancelReason | Nil;
  startsAt: Date;
  onClaim: () => void;
  isActive: boolean;
  isBusy: boolean;
};
