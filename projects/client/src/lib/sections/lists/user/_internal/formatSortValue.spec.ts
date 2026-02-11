import type { ListItem } from '$lib/requests/models/ListItem.ts';
import { describe, expect, it } from 'vitest';
import { MAX_DATE } from '../../../../utils/constants.ts';
import { formatSortValue } from './formatSortValue.ts';

describe('formatSortValue', () => {
  describe('sortBy: added', () => {
    it('should return formatted listedAt date', () => {
      const listItem = {
        listedAt: new Date('2023-01-01T00:00:00.000Z'),
      } as unknown as ListItem;

      expect(formatSortValue(listItem, 'added')).toBe('Jan 1, 2023');
    });
  });

  describe('sortBy: runtime', () => {
    it('should calculate runtime for show', () => {
      const showItem = {
        type: 'show',
        entry: {
          episode: { count: 10 },
          runtime: 30,
        },
      } as unknown as ListItem;

      expect(formatSortValue(showItem, 'runtime')).toBe('5h');
    });

    it('should calculate runtime for movie', () => {
      const movieItem = {
        type: 'movie',
        entry: { runtime: 120 },
      } as unknown as ListItem;
      expect(formatSortValue(movieItem, 'runtime')).toBe('2h');
    });

    it('should calculate runtime for episode', () => {
      const episodeItem = {
        type: 'episode',
        entry: {
          episode: { runtime: 45 },
        },
      } as unknown as ListItem;
      expect(formatSortValue(episodeItem, 'runtime')).toBe('45m');
    });
  });

  describe('sortBy: released', () => {
    it('should return formatted airDate if valid date', () => {
      const validDateItem = {
        type: 'movie',
        entry: { airDate: new Date('2023-02-01') },
      } as unknown as ListItem;
      expect(formatSortValue(validDateItem, 'released')).toBe(
        'Feb 1, 2023',
      );
    });

    it('should return TBA if max date', () => {
      const maxDateItem = {
        type: 'movie',
        entry: { airDate: MAX_DATE },
      } as unknown as ListItem;
      expect(formatSortValue(maxDateItem, 'released')).toBe('TBA');
    });
  });

  describe('sortBy: percentage', () => {
    it('should return formatted rating if rating exists', () => {
      const ratedItem = {
        type: 'movie',
        entry: { rating: 0.7 },
      } as unknown as ListItem;
      expect(formatSortValue(ratedItem, 'percentage')).toBe('70%');
    });

    it('should return undefined if rating is missing', () => {
      const unratedItem = {
        type: 'movie',
        entry: { rating: null },
      } as unknown as ListItem;
      expect(formatSortValue(unratedItem, 'percentage')).toBeUndefined();
    });
  });
});
