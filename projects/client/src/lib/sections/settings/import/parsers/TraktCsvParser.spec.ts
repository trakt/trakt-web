import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TraktCsvParser } from './TraktCsvParser.ts';
import { parseCsvFile } from './utils/parseCsvFile.ts';

vi.mock('./utils/parseCsvFile.ts', () => ({ parseCsvFile: vi.fn() }));

const mockParseCsvFile = vi.mocked(parseCsvFile);

const dummyFile = new File([''], 'trakt.csv', { type: 'text/csv' });

beforeEach(() => {
  mockParseCsvFile.mockResolvedValue([]);
});

describe('TraktCsvParser', () => {
  describe('canParse', () => {
    it('accepts a single csv file', () => {
      expect(TraktCsvParser.canParse([dummyFile])).toBe(true);
    });

    it('rejects non-csv files', () => {
      expect(TraktCsvParser.canParse([new File([''], 'data.json')])).toBe(
        false,
      );
    });

    it('rejects multiple files', () => {
      expect(TraktCsvParser.canParse([dummyFile, dummyFile])).toBe(false);
    });
  });

  describe('parse', () => {
    it('returns empty array for empty file', async () => {
      const result = await TraktCsvParser.parse([dummyFile]);
      expect(result).toHaveLength(0);
    });

    it('returns empty array when no files provided', async () => {
      const result = await TraktCsvParser.parse([]);
      expect(result).toHaveLength(0);
    });

    describe('action field (explicit)', () => {
      it('emits a single history item when action=history', async () => {
        mockParseCsvFile.mockResolvedValue([{
          action: 'history',
          type: 'movie',
          title: 'Inception',
          year: '2010',
          imdb: 'tt1375666',
          watched_at: '2024-01-15T12:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
          action: 'history',
          type: 'movie',
          ids: { imdb: 'tt1375666' },
          title: 'Inception',
          year: 2010,
          watched_at: '2024-01-15T12:00:00.000Z',
        });
      });

      it('emits a single watchlist item when action=watchlist', async () => {
        mockParseCsvFile.mockResolvedValue([{
          action: 'watchlist',
          type: 'movie',
          title: 'Dune',
          year: '2021',
          trakt: '12345',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
          action: 'watchlist',
          ids: { trakt: 12345 },
        });
      });

      it('emits a single ratings item when action=ratings', async () => {
        mockParseCsvFile.mockResolvedValue([{
          action: 'ratings',
          type: 'movie',
          title: 'Inception',
          year: '2010',
          imdb: 'tt1375666',
          rating: '9',
          rated_at: '2024-02-01T00:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
          action: 'ratings',
          rating: 9,
          rated_at: '2024-02-01T00:00:00.000Z',
        });
      });

      it('emits a single ratings item when action=rating (singular)', async () => {
        mockParseCsvFile.mockResolvedValue([{
          action: 'rating',
          type: 'movie',
          title: 'Inception',
          year: '2010',
          imdb: 'tt1375666',
          rating: '8',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result).toHaveLength(1);
        expect(result[0]?.action).toBe('ratings');
      });

      it('does not include rating fields on a history action item', async () => {
        mockParseCsvFile.mockResolvedValue([{
          action: 'history',
          type: 'movie',
          title: 'Inception',
          year: '2010',
          imdb: 'tt1375666',
          rating: '8',
          rated_at: '2024-01-01T00:00:00.000Z',
          watched_at: '2024-01-15T12:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result).toHaveLength(1);
        expect(result[0]?.rating).toBeUndefined();
        expect(result[0]?.rated_at).toBeUndefined();
      });
    });

    describe('no action field (inferred)', () => {
      it('emits a history item when watched_at is present', async () => {
        mockParseCsvFile.mockResolvedValue([{
          type: 'movie',
          title: 'Inception',
          year: '2010',
          imdb: 'tt1375666',
          watched_at: '2024-01-15T12:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result).toHaveLength(1);
        expect(result[0]?.action).toBe('history');
        expect(result[0]?.watched_at).toBe('2024-01-15T12:00:00.000Z');
      });

      it('emits a ratings item when rating is present', async () => {
        mockParseCsvFile.mockResolvedValue([{
          type: 'movie',
          title: 'Inception',
          year: '2010',
          imdb: 'tt1375666',
          rating: '9',
          rated_at: '2024-02-01T00:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result).toHaveLength(1);
        expect(result[0]?.action).toBe('ratings');
        expect(result[0]?.rating).toBe(9);
      });

      it('emits both history and ratings items when both fields are present', async () => {
        mockParseCsvFile.mockResolvedValue([{
          type: 'movie',
          title: 'Inception',
          year: '2010',
          imdb: 'tt1375666',
          watched_at: '2024-01-15T12:00:00.000Z',
          rating: '9',
          rated_at: '2024-02-01T00:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result).toHaveLength(2);
        expect(result.map((i) => i.action).sort()).toEqual([
          'history',
          'ratings',
        ]);
      });

      it('emits a watchlist item when listed_at is present', async () => {
        mockParseCsvFile.mockResolvedValue([{
          type: 'movie',
          title: 'Dune',
          year: '2021',
          imdb: 'tt1160419',
          listed_at: '2024-03-01T00:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result).toHaveLength(1);
        expect(result[0]?.action).toBe('watchlist');
      });

      it('emits a watchlist item when watchlisted_at is present', async () => {
        mockParseCsvFile.mockResolvedValue([{
          type: 'movie',
          title: 'Dune',
          year: '2021',
          imdb: 'tt1160419',
          watchlisted_at: '2024-03-01T00:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result).toHaveLength(1);
        expect(result[0]?.action).toBe('watchlist');
      });
    });

    describe('ID fields', () => {
      it('reads trakt_id as fallback for trakt', async () => {
        mockParseCsvFile.mockResolvedValue([{
          type: 'movie',
          title: 'Inception',
          year: '2010',
          trakt_id: '16662',
          watched_at: '2024-01-15T12:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result[0]?.ids.trakt).toBe(16662);
      });

      it('reads imdb_id as fallback for imdb', async () => {
        mockParseCsvFile.mockResolvedValue([{
          type: 'movie',
          title: 'Inception',
          year: '2010',
          imdb_id: 'tt1375666',
          watched_at: '2024-01-15T12:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result[0]?.ids.imdb).toBe('tt1375666');
      });

      it('reads tmdb_id as fallback for tmdb', async () => {
        mockParseCsvFile.mockResolvedValue([{
          type: 'movie',
          title: 'Inception',
          year: '2010',
          tmdb_id: '27205',
          watched_at: '2024-01-15T12:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result[0]?.ids.tmdb).toBe(27205);
      });

      it('reads tvdb_id as fallback for tvdb', async () => {
        mockParseCsvFile.mockResolvedValue([{
          type: 'episode',
          title: 'Breaking Bad',
          year: '2008',
          tvdb_id: '81189',
          season: '1',
          episode: '1',
          watched_at: '2024-01-15T12:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result[0]?.ids.tvdb).toBe(81189);
      });

      it('filters out rows with no ids and no title+year', async () => {
        mockParseCsvFile.mockResolvedValue([{
          type: 'movie',
          watched_at: '2024-01-15T12:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result).toHaveLength(0);
      });

      it('accepts rows with title+year even without ids', async () => {
        mockParseCsvFile.mockResolvedValue([{
          type: 'movie',
          title: 'Inception',
          year: '2010',
          watched_at: '2024-01-15T12:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result).toHaveLength(1);
        expect(result[0]?.title).toBe('Inception');
        expect(result[0]?.year).toBe(2010);
      });
    });

    describe('type field', () => {
      it('maps show to show type', async () => {
        mockParseCsvFile.mockResolvedValue([{
          type: 'show',
          title: 'Breaking Bad',
          year: '2008',
          trakt: '1388',
          watched_at: '2024-01-15T12:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result[0]?.type).toBe('show');
      });

      it('maps series to show type', async () => {
        mockParseCsvFile.mockResolvedValue([{
          type: 'series',
          title: 'Breaking Bad',
          year: '2008',
          trakt: '1388',
          watched_at: '2024-01-15T12:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result[0]?.type).toBe('show');
      });

      it('maps episode to episode type with season/episode fields', async () => {
        mockParseCsvFile.mockResolvedValue([{
          type: 'episode',
          title: 'Breaking Bad',
          year: '2008',
          trakt: '62315',
          season: '5',
          episode: '14',
          watched_at: '2024-06-01T12:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result[0]).toMatchObject({
          type: 'episode',
          season: 5,
          episode: 14,
        });
      });

      it('defaults to movie for missing/unknown type', async () => {
        mockParseCsvFile.mockResolvedValue([{
          title: 'Inception',
          year: '2010',
          imdb: 'tt1375666',
          watched_at: '2024-01-15T12:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result[0]?.type).toBe('movie');
      });
    });

    describe('title field', () => {
      it('uses name as fallback for title', async () => {
        mockParseCsvFile.mockResolvedValue([{
          type: 'movie',
          name: 'Inception',
          year: '2010',
          imdb: 'tt1375666',
          watched_at: '2024-01-15T12:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result[0]?.title).toBe('Inception');
      });
    });

    describe('date fields', () => {
      it('uses date_watched as fallback for watched_at', async () => {
        mockParseCsvFile.mockResolvedValue([{
          type: 'movie',
          title: 'Inception',
          year: '2010',
          imdb: 'tt1375666',
          date_watched: '2024-05-10T10:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result[0]?.watched_at).toBe('2024-05-10T10:00:00.000Z');
      });

      it('passes through unknown as watched_at', async () => {
        mockParseCsvFile.mockResolvedValue([{
          type: 'movie',
          title: 'Inception',
          year: '2010',
          imdb: 'tt1375666',
          watched_at: 'unknown',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result[0]?.watched_at).toBe('unknown');
      });
    });

    describe('header normalization', () => {
      it('normalizes uppercase header keys', async () => {
        mockParseCsvFile.mockResolvedValue([{
          TYPE: 'movie',
          TITLE: 'Inception',
          YEAR: '2010',
          IMDB: 'tt1375666',
          WATCHED_AT: '2024-01-15T12:00:00.000Z',
        }]);

        const result = await TraktCsvParser.parse([dummyFile]);

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
          type: 'movie',
          title: 'Inception',
          ids: { imdb: 'tt1375666' },
        });
      });
    });
  });
});
