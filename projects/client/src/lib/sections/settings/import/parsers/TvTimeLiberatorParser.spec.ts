import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TvTimeLiberatorParser } from './TvTimeLiberatorParser.ts';
import { parseCsvFile } from './utils/parseCsvFile.ts';

vi.mock('./utils/parseCsvFile.ts', () => ({ parseCsvFile: vi.fn() }));

const mockParseCsvFile = vi.mocked(parseCsvFile);

const dummyFile = new File([''], 'watchlist.csv', { type: 'text/csv' });

beforeEach(() => {
  mockParseCsvFile.mockResolvedValue([]);
});

describe('TvTimeLiberatorParser', () => {
  describe('canParse', () => {
    it('accepts a single csv file', () => {
      expect(TvTimeLiberatorParser.canParse([dummyFile])).toBe(true);
    });

    it('rejects multiple files', () => {
      expect(TvTimeLiberatorParser.canParse([dummyFile, dummyFile])).toBe(
        false,
      );
    });

    it('rejects non-csv files', () => {
      expect(
        TvTimeLiberatorParser.canParse([new File([''], 'data.json')]),
      ).toBe(false);
    });
  });

  describe('parse', () => {
    it('adds a movie to history when is_watched=true', async () => {
      mockParseCsvFile.mockResolvedValue([{
        imdb_id: 'tt1375666',
        tvdb_id: '113',
        type: 'movie',
        title: 'Inception',
        is_watched: 'true',
        watched_at: '2023-01-01T00:00:00Z',
        is_watchlisted: 'false',
      }]);

      const result = await TvTimeLiberatorParser.parse([dummyFile]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'movie',
        ids: { imdb: 'tt1375666', tvdb: 113 },
        title: 'Inception',
        watched_at: '2023-01-01T00:00:00.000Z',
      });
    });

    it('adds a movie to watchlist when is_watchlisted=true', async () => {
      mockParseCsvFile.mockResolvedValue([{
        imdb_id: 'tt1375666',
        tvdb_id: '113',
        type: 'movie',
        title: 'Inception',
        is_watched: 'false',
        watched_at: '',
        is_watchlisted: 'true',
      }]);

      const result = await TvTimeLiberatorParser.parse([dummyFile]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'watchlist',
        type: 'movie',
        ids: { imdb: 'tt1375666', tvdb: 113 },
        title: 'Inception',
      });
    });

    it('emits both history and watchlist when both flags are true', async () => {
      mockParseCsvFile.mockResolvedValue([{
        imdb_id: 'tt1375666',
        tvdb_id: '113',
        type: 'movie',
        title: 'Inception',
        is_watched: 'true',
        watched_at: '2023-01-01T00:00:00Z',
        is_watchlisted: 'true',
      }]);

      const result = await TvTimeLiberatorParser.parse([dummyFile]);

      expect(result).toHaveLength(2);
      expect(result.map((item) => item.action)).toEqual([
        'history',
        'watchlist',
      ]);
    });

    it('skips rows where both flags are false', async () => {
      mockParseCsvFile.mockResolvedValue([{
        imdb_id: 'tt1375666',
        tvdb_id: '113',
        type: 'movie',
        title: 'Inception',
        is_watched: 'false',
        is_watchlisted: 'false',
      }]);

      const result = await TvTimeLiberatorParser.parse([dummyFile]);

      expect(result).toHaveLength(0);
    });

    it('treats imdb_id of -1 as absent', async () => {
      mockParseCsvFile.mockResolvedValue([{
        imdb_id: '-1',
        tvdb_id: '113',
        type: 'movie',
        title: 'Inception',
        is_watched: 'true',
        watched_at: '2023-01-01T00:00:00Z',
        is_watchlisted: 'false',
      }]);

      const result = await TvTimeLiberatorParser.parse([dummyFile]);

      expect(result).toHaveLength(1);
      expect(result[0]?.ids.imdb).toBeUndefined();
      expect(result[0]?.ids.tvdb).toBe(113);
    });

    it('skips rows with no valid ids', async () => {
      mockParseCsvFile.mockResolvedValue([{
        imdb_id: '-1',
        tvdb_id: '',
        type: 'movie',
        title: 'Inception',
        is_watched: 'true',
        watched_at: '2023-01-01T00:00:00Z',
        is_watchlisted: 'false',
      }]);

      const result = await TvTimeLiberatorParser.parse([dummyFile]);

      expect(result).toHaveLength(0);
    });

    it('correctly parses season and episode for episodes', async () => {
      mockParseCsvFile.mockResolvedValue([{
        imdb_id: 'tt0903747',
        tvdb_id: '81189',
        type: 'episode',
        title: 'Breaking Bad',
        season: '3',
        episode: '7',
        is_watched: 'true',
        watched_at: '2023-06-01T00:00:00Z',
        is_watchlisted: 'false',
      }]);

      const result = await TvTimeLiberatorParser.parse([dummyFile]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'episode',
        season: 3,
        episode: 7,
      });
    });

    it('returns empty array for empty file', async () => {
      mockParseCsvFile.mockResolvedValue([]);
      const result = await TvTimeLiberatorParser.parse([dummyFile]);
      expect(result).toHaveLength(0);
    });

    it('returns empty array when no files provided', async () => {
      const result = await TvTimeLiberatorParser.parse([]);
      expect(result).toHaveLength(0);
    });
  });
});
