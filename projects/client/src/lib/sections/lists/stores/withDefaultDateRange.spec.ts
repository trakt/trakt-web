import { describe, expect, it } from 'vitest';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { withDefaultDateRange } from './withDefaultDateRange.ts';

const start = new Date('2025-10-20T00:00:00.000Z');
const end = new Date('2026-10-20T00:00:00.000Z');
const noParams: FilterParams = {};

describe('withDefaultDateRange', () => {
  it('should add both default dates when no filter is set', () => {
    const result = withDefaultDateRange({
      params: noParams,
      range: { start, end },
    });

    expect(result.filter).to.deep.equal({
      start_date: start.toISOString(),
      end_date: end.toISOString(),
    });
  });

  it('should only add the bounds the range provides', () => {
    const result = withDefaultDateRange({ params: noParams, range: { end } });

    expect(result.filter).to.deep.equal({ end_date: end.toISOString() });
  });

  it('should keep the existing filter values', () => {
    const result = withDefaultDateRange({
      params: { filter: { genres: 'drama' } },
      range: { end },
    });

    expect(result.filter).to.deep.equal({
      genres: 'drama',
      end_date: end.toISOString(),
    });
  });

  it('should not mutate the given filter', () => {
    const filter = { genres: 'drama' };

    withDefaultDateRange({ params: { filter }, range: { start, end } });

    expect(filter).to.deep.equal({ genres: 'drama' });
  });

  it('should return the params untouched when years are filtered', () => {
    const params = { filter: { years: '2020-2024' } };

    expect(withDefaultDateRange({ params, range: { start, end } })).to.equal(
      params,
    );
  });

  it('should return the params untouched when a theme is set', () => {
    const params = { theme: 'halloween' };

    expect(withDefaultDateRange({ params, range: { start, end } })).to.equal(
      params,
    );
  });
});
