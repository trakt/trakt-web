import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { PromotionsMappedMock } from '$mocks/data/promotions/mapped/PromotionsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { msUntilNextOfferChange } from './msUntilNextOfferChange.ts';

const offer = assertDefined(PromotionsMappedMock.at(0), 'Offer mock not found');

describe('util: msUntilNextOfferChange', () => {
  it('should return the time until the offer starts', () => {
    const now = new Date(offer.startsAt.getTime() - 5000);

    expect(msUntilNextOfferChange({ offers: PromotionsMappedMock, now })).toBe(
      5000,
    );
  });

  it('should return the time until the offer ends', () => {
    const now = new Date(offer.endsAt.getTime() - 3000);

    expect(msUntilNextOfferChange({ offers: PromotionsMappedMock, now })).toBe(
      3000,
    );
  });

  it('should return null once every offer is over', () => {
    expect(
      msUntilNextOfferChange({
        offers: PromotionsMappedMock,
        now: offer.endsAt,
      }),
    ).toBeNull();
  });
});
