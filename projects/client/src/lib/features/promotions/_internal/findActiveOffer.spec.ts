import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { PromotionsMappedMock } from '$mocks/data/promotions/mapped/PromotionsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { findActiveOffer } from './findActiveOffer.ts';

const offer = assertDefined(PromotionsMappedMock.at(0), 'Offer mock not found');

describe('util: findActiveOffer', () => {
  it('should not find an offer before it starts', () => {
    const now = new Date(offer.startsAt.getTime() - 1);

    expect(findActiveOffer({ offers: PromotionsMappedMock, now })).toBeNull();
  });

  it('should find an offer at its start', () => {
    const result = findActiveOffer({
      offers: PromotionsMappedMock,
      now: offer.startsAt,
    });

    expect(result?.id).toBe(offer.id);
  });

  it('should not find an offer at its end', () => {
    const result = findActiveOffer({
      offers: PromotionsMappedMock,
      now: offer.endsAt,
    });

    expect(result).toBeNull();
  });

  it('should ignore offers with an unknown theme', () => {
    const result = findActiveOffer({
      offers: [{ ...offer, theme: 'unknown' }],
      now: offer.startsAt,
    });

    expect(result).toBeNull();
  });
});
