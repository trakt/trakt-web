import type { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import type { AnalyticsEventDataMap } from '$lib/features/analytics/events/AnalyticsEventDataMap.ts';
import type { VipGateway } from '$lib/requests/models/VipGateway.ts';
import type { VipCancelReason } from '../models/VipCancelReason.ts';
import type { VipRetentionOffer } from '../models/VipRetentionOffer.ts';

type ToVipCancelTrackingParams = {
  reason: VipCancelReason | Nil;
  vipMonths: number;
  offer: VipRetentionOffer | Nil;
  gateway: VipGateway | Nil;
};

const toTenure = (vipMonths: number) => {
  if (vipMonths < 1) return 'under_1m';
  if (vipMonths < 12) return '1_11m';
  if (vipMonths < 24) return '1y';
  return '2y_plus';
};

export function toVipCancelTracking(
  { reason, vipMonths, offer, gateway }: ToVipCancelTrackingParams,
): AnalyticsEventDataMap[typeof AnalyticsEvent.VipCancel] {
  return {
    reason: reason ?? 'none',
    tenure: toTenure(vipMonths),
    offer: offer ? `${offer.source}_${offer.discountedAmount}` : 'none',
    gateway: gateway ?? 'unknown',
  };
}
