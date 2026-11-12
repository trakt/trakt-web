import { describe, expect, it } from 'vitest';
import { toHumanOfferEnd } from './toHumanOfferEnd.ts';

const endsAt = new Date('2030-03-07T08:00:00Z');

describe('util: toHumanOfferEnd', () => {
  it('should show the last day of the offer in the viewer time zone', () => {
    expect(
      toHumanOfferEnd({
        endsAt,
        now: new Date('2030-03-04T12:00:00Z'),
        locale: 'en',
        timeZone: 'America/Los_Angeles',
      }),
    ).toBe('Ends Wed, Mar 6');
  });

  it('should show the same instant on another day in another time zone', () => {
    expect(
      toHumanOfferEnd({
        endsAt,
        now: new Date('2030-03-04T12:00:00Z'),
        locale: 'en',
        timeZone: 'Europe/Berlin',
      }),
    ).toBe('Ends Thu, Mar 7');
  });

  it('should show the time when the offer ends today', () => {
    expect(
      toHumanOfferEnd({
        endsAt,
        now: new Date('2030-03-06T18:00:00Z'),
        locale: 'en',
        timeZone: 'America/Los_Angeles',
      }),
    ).toBe('Ends today, 11:59 PM');
  });

  it('should show the date when the last day is tomorrow in the viewer time zone', () => {
    expect(
      toHumanOfferEnd({
        endsAt,
        now: new Date('2030-03-06T18:00:00Z'),
        locale: 'en',
        timeZone: 'Europe/Berlin',
      }),
    ).toBe('Ends Thu, Mar 7');
  });
});
