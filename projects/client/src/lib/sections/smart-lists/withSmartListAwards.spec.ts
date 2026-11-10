import { describe, expect, it } from 'vitest';
import { withSmartListAwards } from './withSmartListAwards.ts';

const filters = {
  awards: ['oscars-best-picture'],
  award_won: true,
  award_years: [2000, 2026],
  keywords: ['heist'],
};

describe('util: withSmartListAwards', () => {
  it('should set the awards and keep the award settings', () => {
    expect(
      withSmartListAwards({
        filters,
        awards: ['oscars-best-picture', 'palme-dor'],
      }),
    ).toEqual({ ...filters, awards: ['oscars-best-picture', 'palme-dor'] });
  });

  it('should drop the award settings with the last award', () => {
    expect(withSmartListAwards({ filters, awards: [] })).toEqual({
      keywords: ['heist'],
    });
  });
});
