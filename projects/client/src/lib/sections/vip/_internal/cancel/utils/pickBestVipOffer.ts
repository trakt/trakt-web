import type { VipRetentionOffer } from '../models/VipRetentionOffer.ts';

const toSaving = (offer: VipRetentionOffer) =>
  offer.totalPrice - offer.discountedAmount;

export function pickBestVipOffer(
  offers: ReadonlyArray<VipRetentionOffer | Nil>,
): VipRetentionOffer | null {
  return offers.reduce<VipRetentionOffer | null>((best, offer) => {
    if (!offer) return best;
    if (!best) return offer;

    return toSaving(offer) > toSaving(best) ? offer : best;
  }, null);
}
