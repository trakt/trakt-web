import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ImdbParser } from './ImdbParser.ts';
import { parseCsvFile } from './utils/parseCsvFile.ts';

vi.mock('./utils/parseCsvFile.ts', () => ({ parseCsvFile: vi.fn() }));

const mockParseCsvFile = vi.mocked(parseCsvFile);

const dummyFile = new File([''], 'ratings.csv', { type: 'text/csv' });

beforeEach(() => {
  mockParseCsvFile.mockResolvedValue([]);
});

describe('ImdbParser', () => {
  describe('canParse', () => {
    it('accepts a single csv file', () => {
      expect(ImdbParser.canParse([dummyFile])).toBe(true);
    });

    it('accepts multiple csv files', () => {
      expect(ImdbParser.canParse([dummyFile, dummyFile])).toBe(true);
    });

    it('rejects non-csv files', () => {
      expect(ImdbParser.canParse([new File([''], 'data.json')])).toBe(false);
    });

    it('rejects a mix of csv and non-csv files', () => {
      expect(
        ImdbParser.canParse([dummyFile, new File([''], 'data.json')]),
      ).toBe(false);
    });
  });

  describe('parse – ratings file', () => {
    it('emits a rating and a history item for a movie', async () => {
      mockParseCsvFile.mockResolvedValue([{
        Const: 'tt23468450',
        'Your Rating': '8',
        'Date Rated': '2024-09-02',
        Title: 'Longlegs',
        Year: '2024',
        'Title Type': 'movie',
      }]);

      const result = await ImdbParser.parse([dummyFile]);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        action: 'ratings',
        type: 'movie',
        ids: { imdb: 'tt23468450' },
        title: 'Longlegs',
        year: 2024,
        rating: 8,
      });
      expect(result[1]).toMatchObject({
        action: 'history',
        type: 'movie',
        ids: { imdb: 'tt23468450' },
        title: 'Longlegs',
        year: 2024,
      });
    });

    it('emits a rating and a history item for a TV series', async () => {
      mockParseCsvFile.mockResolvedValue([{
        Const: 'tt3909224',
        'Your Rating': '9',
        'Date Rated': '2021-07-04',
        Title: 'The Seven Deadly Sins',
        Year: '2014',
        'Title Type': 'TV Series',
      }]);

      const result = await ImdbParser.parse([dummyFile]);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ action: 'ratings', type: 'show' });
      expect(result[1]).toMatchObject({ action: 'history', type: 'show' });
    });

    it('emits a rating and a history item for a TV mini series', async () => {
      mockParseCsvFile.mockResolvedValue([{
        Const: 'tt0185906',
        'Your Rating': '10',
        'Date Rated': '2020-01-15',
        Title: 'Band of Brothers',
        Year: '2001',
        'Title Type': 'TV Mini Series',
      }]);

      const result = await ImdbParser.parse([dummyFile]);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ action: 'ratings', type: 'show' });
      expect(result[1]).toMatchObject({ action: 'history', type: 'show' });
    });

    it('emits a rating and a history item for a TV Movie', async () => {
      mockParseCsvFile.mockResolvedValue([{
        Const: 'tt0000001',
        'Your Rating': '6',
        'Date Rated': '2022-03-10',
        Title: 'Some TV Movie',
        Year: '2021',
        'Title Type': 'TV Movie',
      }]);

      const result = await ImdbParser.parse([dummyFile]);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ action: 'ratings', type: 'movie' });
      expect(result[1]).toMatchObject({ action: 'history', type: 'movie' });
    });

    it('emits episode items for a TV Episode', async () => {
      mockParseCsvFile.mockResolvedValue([{
        Const: 'tt0959621',
        'Your Rating': '10',
        'Date Rated': '2023-05-01',
        Title: 'Ozymandias',
        Year: '2013',
        'Title Type': 'tvEpisode',
      }]);

      const result = await ImdbParser.parse([dummyFile]);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ action: 'ratings', type: 'episode' });
      expect(result[1]).toMatchObject({ action: 'history', type: 'episode' });
    });

    it('sets rated_at and watched_at from Date Rated as ISO string', async () => {
      mockParseCsvFile.mockResolvedValue([{
        Const: 'tt23468450',
        'Your Rating': '8',
        'Date Rated': '2024-09-02',
        Title: 'Longlegs',
        Year: '2024',
        'Title Type': 'movie',
      }]);

      const result = await ImdbParser.parse([dummyFile]);

      expect(result[0].rated_at).toBe(new Date('2024-09-02').toISOString());
      expect(result[1].watched_at).toBe(new Date('2024-09-02').toISOString());
    });

    it('handles missing Date Rated gracefully', async () => {
      mockParseCsvFile.mockResolvedValue([{
        Const: 'tt23468450',
        'Your Rating': '7',
        Title: 'Longlegs',
        Year: '2024',
        'Title Type': 'movie',
      }]);

      const result = await ImdbParser.parse([dummyFile]);

      expect(result[0].rated_at).toBeUndefined();
      expect(result[1].watched_at).toBeUndefined();
    });

    it('skips rows without a valid tt Const', async () => {
      mockParseCsvFile.mockResolvedValue([{
        Const: 'nm0000123',
        'Your Rating': '8',
        Title: 'Some Person',
        'Title Type': 'movie',
      }]);

      const result = await ImdbParser.parse([dummyFile]);

      expect(result).toHaveLength(0);
    });

    it('skips rows with missing Const', async () => {
      mockParseCsvFile.mockResolvedValue([{
        'Your Rating': '8',
        Title: 'Unknown',
        'Title Type': 'movie',
      }]);

      const result = await ImdbParser.parse([dummyFile]);

      expect(result).toHaveLength(0);
    });

    it('defaults to movie type for unknown Title Type', async () => {
      mockParseCsvFile.mockResolvedValue([{
        Const: 'tt9999999',
        'Your Rating': '5',
        'Date Rated': '2023-01-01',
        Title: 'Mystery',
        Year: '2023',
        'Title Type': 'videoGame',
      }]);

      const result = await ImdbParser.parse([dummyFile]);

      expect(result).toHaveLength(2);
      expect(result[0].type).toBe('movie');
    });

    it('returns empty array for empty file', async () => {
      mockParseCsvFile.mockResolvedValue([]);

      const result = await ImdbParser.parse([dummyFile]);

      expect(result).toHaveLength(0);
    });

    it('aggregates results from multiple files', async () => {
      const secondFile = new File([''], 'ratings2.csv', { type: 'text/csv' });
      mockParseCsvFile
        .mockResolvedValueOnce([{
          Const: 'tt1111111',
          'Your Rating': '7',
          'Date Rated': '2023-01-01',
          Title: 'Movie One',
          Year: '2020',
          'Title Type': 'movie',
        }])
        .mockResolvedValueOnce([{
          Const: 'tt2222222',
          'Your Rating': '9',
          'Date Rated': '2023-06-01',
          Title: 'Movie Two',
          Year: '2022',
          'Title Type': 'movie',
        }]);

      const result = await ImdbParser.parse([dummyFile, secondFile]);

      expect(result).toHaveLength(4);
      expect(result.map((i) => i.ids.imdb)).toEqual([
        'tt1111111',
        'tt1111111',
        'tt2222222',
        'tt2222222',
      ]);
    });
  });

  describe('parse – watchlist file', () => {
    it('emits a watchlist item for a movie', async () => {
      mockParseCsvFile.mockResolvedValue([{
        Const: 'tt3909224',
        Created: '2021-07-04',
        Title: 'The Seven Deadly Sins',
        Year: '2014',
        'Title Type': 'TV Series',
      }]);

      const result = await ImdbParser.parse([dummyFile]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'watchlist',
        type: 'show',
        ids: { imdb: 'tt3909224' },
        title: 'The Seven Deadly Sins',
        year: 2014,
      });
    });

    it('maps tvseries title type to show', async () => {
      mockParseCsvFile.mockResolvedValue([{
        Const: 'tt0903747',
        Created: '2022-01-01',
        Title: 'Breaking Bad',
        Year: '2008',
        'Title Type': 'tvSeries',
      }]);

      const result = await ImdbParser.parse([dummyFile]);

      expect(result[0]).toMatchObject({ action: 'watchlist', type: 'show' });
    });

    it('skips rows without a valid tt Const', async () => {
      mockParseCsvFile.mockResolvedValue([{
        Const: 'nm1234567',
        Created: '2021-01-01',
        Title: 'Some Actor',
        'Title Type': 'movie',
      }]);

      const result = await ImdbParser.parse([dummyFile]);

      expect(result).toHaveLength(0);
    });

    it('handles missing Title Type by defaulting to movie', async () => {
      mockParseCsvFile.mockResolvedValue([{
        Const: 'tt9999998',
        Created: '2021-01-01',
        Title: 'No Type',
        Year: '2021',
      }]);

      const result = await ImdbParser.parse([dummyFile]);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('movie');
    });

    it('returns empty array for empty file', async () => {
      mockParseCsvFile.mockResolvedValue([]);

      const result = await ImdbParser.parse([dummyFile]);

      expect(result).toHaveLength(0);
    });
  });
});
