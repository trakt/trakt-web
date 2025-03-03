import type { Genre } from '@trakt/api';
import { describe, expect, it } from 'vitest';
import {
  genreCompareFactory,
  type MediaSummarySortInfo,
} from './genreCompareFactory.ts';

function createItem(genre: Genre, year: number) {
  return {
    airDate: new Date(`${year}-01-01`),
    genres: [genre],
  };
}

describe('store: genreCompareFactory', () => {
  describe('year sort: asc', () => {
    it('should prioritize Action and Horror grouped by year', () => {
      const genres: Genre[] = ['action', 'horror'];

      const mediaList: MediaSummarySortInfo[] = [
        createItem('comedy', 2021),
        createItem('horror', 2021),
        createItem('animation', 2020),
        createItem('action', 2020),
      ];

      const { compare } = genreCompareFactory(genres, 'asc', 'year');

      expect(mediaList.sort(compare)).toEqual([
        createItem('action', 2020),
        createItem('animation', 2020),
        createItem('horror', 2021),
        createItem('comedy', 2021),
      ]);
    });

    it('should prioritize Action and Horror grouped by genre', () => {
      const genres: Genre[] = ['action', 'horror'];

      const mediaList: MediaSummarySortInfo[] = [
        createItem('animation', 2021),
        createItem('horror', 2021),
        createItem('comedy', 2020),
        createItem('horror', 2020),
        createItem('action', 2020),
        createItem('action', 1999),
      ];

      const { compare } = genreCompareFactory(genres, 'asc', 'genre');
      expect(mediaList.sort(compare)).toEqual([
        createItem('action', 1999),
        createItem('action', 2020),
        createItem('horror', 2020),
        createItem('horror', 2021),
        createItem('comedy', 2020),
        createItem('animation', 2021),
      ]);
    });
  });

  describe('year sort: desc', () => {
    it('should prioritize Action and Horror grouped by year', () => {
      const genres: Genre[] = ['action', 'horror'];

      const mediaList: MediaSummarySortInfo[] = [
        createItem('comedy', 2021),
        createItem('horror', 2021),
        createItem('animation', 2020),
        createItem('action', 2020),
      ];

      const { compare } = genreCompareFactory(genres, 'desc', 'year');

      expect(mediaList.sort(compare)).toEqual([
        createItem('horror', 2021),
        createItem('comedy', 2021),
        createItem('action', 2020),
        createItem('animation', 2020),
      ]);
    });

    it('should prioritize Action and Horror grouped by genre', () => {
      const genres: Genre[] = ['action', 'horror'];

      const mediaList: MediaSummarySortInfo[] = [
        createItem('animation', 2021),
        createItem('horror', 2021),
        createItem('comedy', 2020),
        createItem('horror', 2020),
        createItem('action', 2020),
        createItem('action', 1999),
      ];

      const { compare } = genreCompareFactory(genres, 'desc', 'genre');

      expect(mediaList.sort(compare)).toEqual([
        createItem('action', 2020),
        createItem('action', 1999),
        createItem('horror', 2021),
        createItem('horror', 2020),
        createItem('animation', 2021),
        createItem('comedy', 2020),
      ]);
    });
  });
});
