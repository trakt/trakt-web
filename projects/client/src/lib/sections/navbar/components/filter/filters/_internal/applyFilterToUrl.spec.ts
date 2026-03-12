import { FilterKey } from '$lib/features/filters/models/Filter.ts';
import { describe, expect, it } from 'vitest';
import { applyFilterToUrl } from './applyFilterToUrl.ts';

const BASE_URL = 'https://trakt.tv/';

describe('applyFilterToUrl', () => {
  describe('with value prop', () => {
    it('sets the search param when value is non-null', () => {
      const url = applyFilterToUrl(
        new URL(BASE_URL),
        { key: FilterKey.Genres, value: 'action' },
      );

      expect(url.searchParams.get(FilterKey.Genres)).toBe('action');
    });

    it('deletes the search param when value is null', () => {
      const url = applyFilterToUrl(
        new URL(`${BASE_URL}?${FilterKey.Genres}=action`),
        { key: FilterKey.Genres, value: null },
      );

      expect(url.searchParams.has(FilterKey.Genres)).toBe(false);
    });
  });

  describe('with range prop', () => {
    it('formats the range as "min-max" and sets the param', () => {
      const url = applyFilterToUrl(
        new URL(BASE_URL),
        { key: FilterKey.Ratings, range: { min: 1, max: 10 } },
      );

      expect(url.searchParams.get(FilterKey.Ratings)).toBe('1-10');
    });

    it('deletes the param when range is null', () => {
      const url = applyFilterToUrl(
        new URL(`${BASE_URL}?${FilterKey.Ratings}=1-10`),
        { key: FilterKey.Ratings, range: null },
      );

      expect(url.searchParams.has(FilterKey.Ratings)).toBe(false);
    });

    it('sets additional keys with the same value when no mapper is provided', () => {
      const url = applyFilterToUrl(
        new URL(BASE_URL),
        {
          key: FilterKey.Ratings,
          range: { min: 1, max: 10 },
          additionalKeys: [{ key: FilterKey.ImdbRatings }],
        },
      );

      expect(url.searchParams.get(FilterKey.Ratings)).toBe('1-10');
      expect(url.searchParams.get(FilterKey.ImdbRatings)).toBe('1-10');
    });

    it('applies the mapper to additional keys when a mapper is provided', () => {
      const url = applyFilterToUrl(
        new URL(BASE_URL),
        {
          key: FilterKey.Ratings,
          range: { min: 1, max: 10 },
          additionalKeys: [{
            key: FilterKey.ImdbRatings,
            mapper: ({ min, max }) => `${min * 10}-${max * 10}`,
          }],
        },
      );

      expect(url.searchParams.get(FilterKey.Ratings)).toBe('1-10');
      expect(url.searchParams.get(FilterKey.ImdbRatings)).toBe('10-100');
    });

    it('deletes all additional keys when range is null', () => {
      const url = applyFilterToUrl(
        new URL(
          `${BASE_URL}?${FilterKey.Ratings}=1-10&${FilterKey.ImdbRatings}=10-100`,
        ),
        {
          key: FilterKey.Ratings,
          range: null,
          additionalKeys: [{ key: FilterKey.ImdbRatings }],
        },
      );

      expect(url.searchParams.has(FilterKey.Ratings)).toBe(false);
      expect(url.searchParams.has(FilterKey.ImdbRatings)).toBe(false);
    });
  });

  describe('with an array of props', () => {
    it('applies all props to the URL', () => {
      const url = applyFilterToUrl(
        new URL(BASE_URL),
        [
          { key: FilterKey.Genres, value: 'action' },
          { key: FilterKey.Ratings, range: { min: 5, max: 10 } },
        ],
      );

      expect(url.searchParams.get(FilterKey.Genres)).toBe('action');
      expect(url.searchParams.get(FilterKey.Ratings)).toBe('5-10');
    });

    it('can delete some params while setting others', () => {
      const url = applyFilterToUrl(
        new URL(`${BASE_URL}?${FilterKey.Genres}=action`),
        [
          { key: FilterKey.Genres, value: null },
          { key: FilterKey.Ratings, range: { min: 5, max: 10 } },
        ],
      );

      expect(url.searchParams.has(FilterKey.Genres)).toBe(false);
      expect(url.searchParams.get(FilterKey.Ratings)).toBe('5-10');
    });
  });

  it('preserves existing URL params not affected by the filter', () => {
    const url = applyFilterToUrl(
      new URL(`${BASE_URL}?unrelated=value`),
      { key: FilterKey.Genres, value: 'action' },
    );

    expect(url.searchParams.get('unrelated')).toBe('value');
    expect(url.searchParams.get(FilterKey.Genres)).toBe('action');
  });
});
