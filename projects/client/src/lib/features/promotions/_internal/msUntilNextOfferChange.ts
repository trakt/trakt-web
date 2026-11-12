import type { PromotionOffer } from '$lib/requests/models/PromotionOffer.ts';

type MsUntilNextOfferChangeProps = {
  offers: ReadonlyArray<PromotionOffer>;
  now: Date;
};

export function msUntilNextOfferChange({
  offers,
  now,
}: MsUntilNextOfferChangeProps): number | null {
  const upcoming = offers
    .flatMap(({ startsAt, endsAt }) => [startsAt, endsAt])
    .map((instant) => instant.getTime() - now.getTime())
    .filter((ms) => ms > 0);

  return upcoming.length === 0 ? null : Math.min(...upcoming);
}
