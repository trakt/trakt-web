import type { VipCancelReason } from '../models/VipCancelReason.ts';
import type { VipRetentionOffer } from '../models/VipRetentionOffer.ts';
import { cleanCancelDetails } from './cleanCancelDetails.ts';

const DETAILED_REASONS: ReadonlyArray<VipCancelReason> = ['feature', 'other'];

type ToVipCancelTrackingParams = {
  reason: VipCancelReason | Nil;
  details: string;
  vipMonths: number;
  offer: VipRetentionOffer | Nil;
};

const toTenure = (vipMonths: number) => {
  if (vipMonths < 1) return 'under_1m';
  if (vipMonths < 12) return '1_11m';
  if (vipMonths < 24) return '1y';
  return '2y_plus';
};

export function toVipCancelTracking(
  { reason, details, vipMonths, offer }: ToVipCancelTrackingParams,
): Record<string, string> {
  const cleaned = reason && DETAILED_REASONS.includes(reason)
    ? cleanCancelDetails(details)
    : '';

  return {
    reason: reason ?? 'none',
    tenure: toTenure(vipMonths),
    offer: offer ? `${offer.source}_${offer.discountedAmount}` : 'none',
    ...(cleaned ? { details: cleaned } : {}),
  };
}
