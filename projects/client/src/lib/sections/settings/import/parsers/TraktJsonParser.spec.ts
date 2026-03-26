import { describe, expect, it, vi } from 'vitest';
import { TraktJsonParser } from './TraktJsonParser.ts';

vi.mock('fflate', () => ({
  unzipSync: vi.fn(),
}));

vi.mock('./utils/parseJsonFile.ts', () => ({
  parseJsonFile: vi.fn(),
}));

const { unzipSync } = await import('fflate');
const { parseJsonFile } = await import('./utils/parseJsonFile.ts');
const mockUnzip = vi.mocked(unzipSync);
const mockParseJsonFile = vi.mocked(parseJsonFile);

function makeFile(name: string): File {
  return new File([''], name);
}

describe('TraktJsonParser', () => {
  describe('canParse', () => {
    it('accepts a single json file', () => {
      expect(TraktJsonParser.canParse([makeFile('history.json')])).toBe(true);
    });

    it('accepts a single zip file', () => {
      expect(TraktJsonParser.canParse([makeFile('export.zip')])).toBe(true);
    });

    it('rejects non-json/non-zip files', () => {
      expect(TraktJsonParser.canParse([makeFile('data.csv')])).toBe(false);
    });

    it('rejects multiple files', () => {
      expect(
        TraktJsonParser.canParse([makeFile('a.json'), makeFile('b.json')]),
      ).toBe(false);
    });
  });

  describe('parse – single JSON', () => {
    it('parses a watched movie entry', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          type: 'movie',
          watched_at: '2024-01-15T12:00:00.000Z',
          movie: {
            title: 'Inception',
            year: 2010,
            ids: { trakt: 16662, imdb: 'tt1375666', tmdb: 27205 },
          },
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('history.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'movie',
        ids: { trakt: 16662, imdb: 'tt1375666', tmdb: 27205 },
        title: 'Inception',
        year: 2010,
      });
    });

    it('parses a watched show entry', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          type: 'show',
          watched_at: '2024-01-15T12:00:00.000Z',
          show: {
            title: 'Breaking Bad',
            year: 2008,
            ids: { trakt: 1388, imdb: 'tt0903747' },
          },
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('history.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'show',
        ids: { trakt: 1388, imdb: 'tt0903747' },
        title: 'Breaking Bad',
        year: 2008,
      });
    });

    it('parses a watchlist entry', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          type: 'movie',
          listed_at: '2024-03-01T00:00:00.000Z',
          movie: {
            title: 'Dune',
            year: 2021,
            ids: { trakt: 1, imdb: 'tt1160419', tmdb: 438631 },
          },
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('watchlist.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'watchlist',
        type: 'movie',
      });
    });

    it('parses a rating entry', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          type: 'movie',
          rating: 9,
          rated_at: '2024-02-01T00:00:00.000Z',
          movie: {
            title: 'Inception',
            year: 2010,
            ids: { trakt: 16662 },
          },
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('ratings.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'ratings',
        rating: 9,
      });
    });

    it('passes through unknown as watched_at', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          type: 'movie',
          watched_at: 'unknown',
          movie: {
            title: 'Inception',
            year: 2010,
            ids: { trakt: 16662 },
          },
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('history.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]?.watched_at).toBe('unknown');
    });

    it('returns empty array for no files', async () => {
      const result = await TraktJsonParser.parse([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('parse – nested id object format', () => {
    it('parses a watched entry with id: { trakt, imdb } at root level', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          id: { trakt: 16662, imdb: 'tt1375666', tmdb: 27205 },
          title: 'Inception',
          year: 2010,
          watched_at: '2024-01-15T12:00:00.000Z',
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('list.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'movie',
        ids: { trakt: 16662, imdb: 'tt1375666', tmdb: 27205 },
        title: 'Inception',
        year: 2010,
      });
    });

    it('infers watchlist action via listed_at on a nested-id entry', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          id: { trakt: 1 },
          title: 'Dune',
          year: 2021,
          listed_at: '2024-03-01T00:00:00.000Z',
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('watchlist.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]?.action).toBe('watchlist');
    });

    it('infers ratings action via rated_at on a nested-id entry', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          id: { trakt: 16662 },
          title: 'Inception',
          year: 2010,
          rating: 8,
          rated_at: '2024-02-01T00:00:00.000Z',
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('ratings.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ action: 'ratings', rating: 8 });
    });

    it('falls back to created_at when watched_at is absent', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          id: { imdb: 'tt1375666' },
          title: 'Inception',
          year: 2010,
          created_at: '2024-01-19T19:14:43Z',
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('list.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]?.watched_at).toBe('2024-01-19T19:14:43.000Z');
    });
  });

  describe('parse – flat *_id format', () => {
    it('parses a watched movie entry with root-level imdb_id/tvdb_id fields', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          imdb_id: 'tt1374992',
          tvdb_id: 3671,
          title: 'Upside Down',
          watched_at: '2024-01-19T19:14:56Z',
          is_watched: true,
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('movies.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'movie',
        ids: { imdb: 'tt1374992', tvdb: 3671 },
        title: 'Upside Down',
      });
    });

    it('parses a watchlist entry via is_watchlisted field', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          imdb_id: 'tt1374992',
          title: 'Upside Down',
          is_watchlisted: true,
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('watchlist.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ action: 'watchlist', type: 'movie' });
    });

    it('parses a watchlist entry via watchlisted_at field', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          imdb_id: 'tt1374992',
          title: 'Upside Down',
          watchlisted_at: '2024-03-01T00:00:00.000Z',
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('watchlist.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ action: 'watchlist', type: 'movie' });
    });

    it('falls back to created_at when watched_at is absent', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          imdb_id: 'tt0439572',
          title: 'The Flash',
          created_at: '2024-01-19T19:14:43Z',
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('movies.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]?.watched_at).toBe('2024-01-19T19:14:43.000Z');
    });

    it('supports date_watched as an alternative to watched_at', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          imdb_id: 'tt0439572',
          title: 'The Flash',
          date_watched: '2024-05-10T10:00:00.000Z',
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('movies.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]?.watched_at).toBe('2024-05-10T10:00:00.000Z');
    });

    it('filters out entries with no valid ids', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          title: 'No IDs at all',
          watched_at: '2024-01-01T00:00:00.000Z',
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('movies.json')]);

      expect(result).toHaveLength(0);
    });
  });

  describe('parse – ZIP export', () => {
    function setupZip(files: Record<string, unknown[]>) {
      const encoder = new TextEncoder();
      const zipEntries: Record<string, Uint8Array> = {};

      for (const [filename, data] of Object.entries(files)) {
        zipEntries[filename] = encoder.encode(JSON.stringify(data));
      }

      mockUnzip.mockReturnValue(
        zipEntries as unknown as ReturnType<typeof unzipSync>,
      );
    }

    it('parses watched history from zip', async () => {
      setupZip({
        'watched/history-movies.json': [
          {
            type: 'movie',
            watched_at: '2024-01-15T12:00:00.000Z',
            movie: {
              title: 'Inception',
              year: 2010,
              ids: { trakt: 16662, imdb: 'tt1375666', tmdb: 27205 },
            },
          },
        ],
      });

      const result = await TraktJsonParser.parse([makeFile('export.zip')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'movie',
        title: 'Inception',
      });
    });

    it('parses watchlist from zip', async () => {
      setupZip({
        'lists/watchlist.json': [
          {
            type: 'movie',
            listed_at: '2024-03-01T00:00:00.000Z',
            movie: {
              title: 'Dune',
              year: 2021,
              ids: { trakt: 1, imdb: 'tt1160419', tmdb: 438631 },
            },
          },
        ],
      });

      const result = await TraktJsonParser.parse([makeFile('export.zip')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'watchlist',
        type: 'movie',
        title: 'Dune',
      });
    });

    it('parses ratings from zip', async () => {
      setupZip({
        'ratings/ratings-movies.json': [
          {
            type: 'movie',
            rating: 10,
            rated_at: '2024-02-01T00:00:00.000Z',
            movie: {
              title: 'Inception',
              year: 2010,
              ids: { trakt: 16662 },
            },
          },
        ],
      });

      const result = await TraktJsonParser.parse([makeFile('export.zip')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'ratings',
        rating: 10,
      });
    });

    it('merges items from multiple json files in zip', async () => {
      setupZip({
        'watched/history-movies.json': [
          {
            type: 'movie',
            watched_at: '2024-01-15T12:00:00.000Z',
            movie: {
              title: 'Inception',
              year: 2010,
              ids: { trakt: 16662 },
            },
          },
        ],
        'lists/watchlist.json': [
          {
            type: 'movie',
            listed_at: '2024-03-01T00:00:00.000Z',
            movie: {
              title: 'Dune',
              year: 2021,
              ids: { trakt: 1 },
            },
          },
        ],
        'ratings/ratings-movies.json': [
          {
            type: 'movie',
            rating: 8,
            rated_at: '2024-02-01T00:00:00.000Z',
            movie: {
              title: 'Tenet',
              year: 2020,
              ids: { trakt: 2 },
            },
          },
        ],
      });

      const result = await TraktJsonParser.parse([makeFile('export.zip')]);

      expect(result).toHaveLength(3);
      expect(result.map((i) => i.action).sort()).toEqual([
        'history',
        'ratings',
        'watchlist',
      ]);
    });

    it('ignores non-relevant json files in zip', async () => {
      setupZip({
        'collection/collection-movies.json': [
          {
            type: 'movie',
            collected_at: '2024-01-01T00:00:00.000Z',
            movie: {
              title: 'Ignored',
              year: 2020,
              ids: { trakt: 999 },
            },
          },
        ],
        'watched/history-movies.json': [
          {
            type: 'movie',
            watched_at: '2024-01-15T12:00:00.000Z',
            movie: {
              title: 'Inception',
              year: 2010,
              ids: { trakt: 16662 },
            },
          },
        ],
      });

      const result = await TraktJsonParser.parse([makeFile('export.zip')]);

      expect(result).toHaveLength(1);
      expect(result[0]?.title).toBe('Inception');
    });

    it('parses episode entries from zip', async () => {
      setupZip({
        'watched/history-episodes.json': [
          {
            type: 'episode',
            watched_at: '2024-06-01T12:00:00.000Z',
            show: {
              title: 'Breaking Bad',
              year: 2008,
              ids: { trakt: 1388 },
            },
            episode: {
              season: 5,
              number: 14,
              ids: { trakt: 62315, tvdb: 4639411 },
            },
          },
        ],
      });

      const result = await TraktJsonParser.parse([makeFile('export.zip')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'episode',
        title: 'Breaking Bad',
        season: 5,
        episode: 14,
        ids: { trakt: 62315, tvdb: 4639411 },
      });
    });

    it('returns empty for no files', async () => {
      const result = await TraktJsonParser.parse([]);
      expect(result).toHaveLength(0);
    });
  });
});
