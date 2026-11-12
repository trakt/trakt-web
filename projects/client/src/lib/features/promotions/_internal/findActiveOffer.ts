import type { PromotionOffer } from '$lib/requests/models/PromotionOffer.ts';
import { PromotionOfferThemeSchema } from '../models/PromotionOfferTheme.ts';

type FindActiveOfferProps = {
  offers: ReadonlyArray<PromotionOffer>;
  now: Date;
};

export function findActiveOffer({
  offers,
  now,
}: FindActiveOfferProps): PromotionOffer | null {
  return (
    offers.find(
      (offer) =>
        PromotionOfferThemeSchema.safeParse(offer.theme).success &&
        now >= offer.startsAt &&
        now < offer.endsAt,
    ) ?? null
  );
}
