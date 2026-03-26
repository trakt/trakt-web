import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TvTimeCsvParser } from './TvTimeCsvParser.ts';
import { parseCsvFile } from './utils/parseCsvFile.ts';

vi.mock('./utils/parseCsvFile.ts', () => ({ parseCsvFile: vi.fn() }));

const mockParseCsvFile = vi.mocked(parseCsvFile);

const dummyFile = new File([''], 'tvtime.csv', { type: 'text/csv' });

beforeEach(() => {
  mockParseCsvFile.mockResolvedValue([]);
});

describe('TvTimeCsvParser', () => {
  describe('canParse', () => {
    it('accepts a single csv file', () => {
      expect(TvTimeCsvParser.canParse([dummyFile])).toBe(true);
    });

    it('rejects multiple files', () => {
      expect(TvTimeCsvParser.canParse([dummyFile, dummyFile])).toBe(false);
    });

    it('rejects non-csv files', () => {
      expect(TvTimeCsvParser.canParse([new File([''], 'data.json')])).toBe(
        false,
      );
    });
  });

  describe('export format (imdb_id/tvdb_id columns)', () => {
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

      const result = await TvTimeCsvParser.parse([dummyFile]);

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

      const result = await TvTimeCsvParser.parse([dummyFile]);

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

      const result = await TvTimeCsvParser.parse([dummyFile]);

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

      const result = await TvTimeCsvParser.parse([dummyFile]);

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

      const result = await TvTimeCsvParser.parse([dummyFile]);

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

      const result = await TvTimeCsvParser.parse([dummyFile]);

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

      const result = await TvTimeCsvParser.parse([dummyFile]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'episode',
        season: 3,
        episode: 7,
      });
    });
  });

  describe('native format (ts/show_name/episode_id columns)', () => {
    it('adds an episode to history', async () => {
      const ts = String(
        Math.floor(new Date('2023-06-01T12:00:00Z').getTime() / 1000),
      );
      mockParseCsvFile.mockResolvedValue([{
        ts,
        show_name: 'Breaking Bad',
        episode_id: '81189',
        episode_season_number: '3',
        episode_number: '7',
        episode_name: 'One Minute',
      }]);

      const result = await TvTimeCsvParser.parse([dummyFile]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'episode',
        ids: { tvdb: 81189 },
        title: 'Breaking Bad',
        season: 3,
        episode: 7,
      });
    });

    it('skips rows without episode_id', async () => {
      mockParseCsvFile.mockResolvedValue([{
        ts: '1685620800',
        show_name: 'Breaking Bad',
        episode_id: '',
        episode_season_number: '3',
        episode_number: '7',
      }]);

      const result = await TvTimeCsvParser.parse([dummyFile]);

      expect(result).toHaveLength(0);
    });

    it('skips rows with non-numeric episode_id', async () => {
      mockParseCsvFile.mockResolvedValue([{
        ts: '1685620800',
        show_name: 'Breaking Bad',
        episode_id: 'not-a-number',
        episode_season_number: '3',
        episode_number: '7',
      }]);

      const result = await TvTimeCsvParser.parse([dummyFile]);

      expect(result).toHaveLength(0);
    });
  });

  it('returns empty array when no files are provided', async () => {
    const result = await TvTimeCsvParser.parse([]);
    expect(result).toHaveLength(0);
  });
});
