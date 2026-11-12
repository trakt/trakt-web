import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { PromotionsMappedMock } from '$mocks/data/promotions/mapped/PromotionsMappedMock.ts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { watchActiveOffer } from './watchActiveOffer.ts';

const offer = assertDefined(PromotionsMappedMock.at(0), 'Offer mock not found');

describe('util: watchActiveOffer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should flip exactly at the start and end of an offer', () => {
    vi.setSystemTime(new Date(offer.startsAt.getTime() - 1000));
    const emitted: Array<string | null> = [];

    const subscription = watchActiveOffer(PromotionsMappedMock).subscribe(
      (active) => emitted.push(active?.id ?? null),
    );

    vi.advanceTimersByTime(1000);
    vi.advanceTimersByTime(offer.endsAt.getTime() - offer.startsAt.getTime());
    subscription.unsubscribe();

    expect(emitted).toEqual([null, offer.id, null]);
  });
});
