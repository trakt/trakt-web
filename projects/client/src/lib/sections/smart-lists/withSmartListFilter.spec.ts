import { describe, expect, it } from 'vitest';
import { withSmartListFilter } from './withSmartListFilter.ts';

describe('withSmartListFilter', () => {
  it('should set a filter value', () => {
    expect(
      withSmartListFilter({
        filters: { genres: ['drama'] },
        key: 'keywords',
        value: ['heist'],
      }),
    ).toEqual({ genres: ['drama'], keywords: ['heist'] });
  });

  it('should drop a filter when its value is empty', () => {
    expect(
      withSmartListFilter({
        filters: { keywords: ['heist'] },
        key: 'keywords',
        value: [],
      }),
    ).toEqual({});
    expect(
      withSmartListFilter({
        filters: { ignore_ended: true },
        key: 'ignore_ended',
        value: false,
      }),
    ).toEqual({});
    expect(
      withSmartListFilter({
        filters: { released_within_days: 30 },
        key: 'released_within_days',
        value: null,
      }),
    ).toEqual({});
  });
});
