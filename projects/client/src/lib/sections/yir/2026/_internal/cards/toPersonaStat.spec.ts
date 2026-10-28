import { describe, expect, it } from 'vitest';
import { toPersonaStat } from './toPersonaStat.ts';

describe('util: toPersonaStat', () => {
  it('should group plain counts', () => {
    expect(
      toPersonaStat({
        highlight: { kind: 'anime-episodes', value: 2453 },
        totalMonths: null,
      }),
    ).toEqual({
      key: 'anime-episodes',
      value: '2,453',
      label: 'anime episodes',
    });
  });

  it('should suffix shares with a percent sign', () => {
    expect(
      toPersonaStat({
        highlight: { kind: 'anime-share', value: 97 },
        totalMonths: null,
      }).value,
    ).toBe('97%');
  });

  it('should keep one decimal for decimal kinds', () => {
    expect(
      toPersonaStat({
        highlight: { kind: 'avg-rating', value: 7.24 },
        totalMonths: null,
      }).value,
    ).toBe('7.2');
  });

  it('should group rewatches as a plain count', () => {
    expect(
      toPersonaStat({
        highlight: { kind: 'rewatches', value: 1412 },
        totalMonths: null,
      }),
    ).toEqual({
      key: 'rewatches',
      value: '1,412',
      label: 'rewatches',
    });
  });

  it('should not group years', () => {
    expect(
      toPersonaStat({
        highlight: { kind: 'avg-vintage', value: 2007 },
        totalMonths: null,
      }).value,
    ).toBe('2007');
  });

  it('should show months won against the real months', () => {
    expect(
      toPersonaStat({
        highlight: { kind: 'months-won', value: 6 },
        totalMonths: 10,
      }),
    ).toEqual({ key: 'months-won', value: '6', label: 'of 10 months' });
  });

  it('should label shares by the months won when the year was won by months', () => {
    expect(
      toPersonaStat({
        highlight: { kind: 'top-show-share', value: 69 },
        totalMonths: 10,
      }),
    ).toEqual({
      key: 'top-show-share',
      value: '69%',
      label: "of episodes in those months went to that month's top show",
    });
  });

  it('should keep the year label for counts when the year was won by months', () => {
    expect(
      toPersonaStat({
        highlight: { kind: 'top-show-episodes', value: 101 },
        totalMonths: 10,
      }).label,
    ).toBe(
      toPersonaStat({
        highlight: { kind: 'top-show-episodes', value: 101 },
        totalMonths: null,
      }).label,
    );
  });
});
