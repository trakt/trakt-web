import { languageTag } from '$lib/features/i18n/index.ts';
import type { PromotionOffer } from '$lib/requests/models/PromotionOffer.ts';
import { toHumanCurrency } from '$lib/utils/formatting/currency/toHumanCurrency.ts';

type ToHumanOfferPriceProps = {
  offer: PromotionOffer;
  kind: 'discounted' | 'full';
};

export function toHumanOfferPrice({ offer, kind }: ToHumanOfferPriceProps) {
  return toHumanCurrency({
    price:
      kind === 'discounted' ? offer.plan.discountedPrice : offer.plan.fullPrice,
    currency: offer.plan.currency,
    locale: languageTag(),
  });
}
