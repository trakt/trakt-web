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

    it('respects an explicit show type', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          tmdb_id: '67324',
          type: 'show',
          watched_at: '2026-08-14T10:47:49.000Z',
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('history.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'show',
        ids: { tmdb: 67324 },
      });
    });

    it('respects an explicit season type', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          tvdb_id: '12345',
          type: 'season',
          watched_at: '2026-08-14T10:47:49.000Z',
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('history.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'season',
        ids: { tvdb: 12345 },
      });
    });

    it('respects an explicit episode type', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          tmdb_id: '66452',
          type: 'episode',
          watched_at: '2026-08-15T08:20:22.419Z',
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('history.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'episode',
        ids: { tmdb: 66452 },
      });
    });

    it('treats series as an alias for show', async () => {
      mockParseJsonFile.mockResolvedValue([
        { imdb_id: 'tt0306414', type: 'series' },
      ]);

      const result = await TraktJsonParser.parse([makeFile('history.json')]);

      expect(result[0]).toMatchObject({ type: 'show' });
    });

    it('defaults to movie when no type is given', async () => {
      mockParseJsonFile.mockResolvedValue([
        { imdb_id: 'tt1374992', watched_at: '2024-01-19T19:14:56Z' },
      ]);

      const result = await TraktJsonParser.parse([makeFile('history.json')]);

      expect(result[0]).toMatchObject({ type: 'movie' });
    });

    it('respects an explicit type in the nested id format', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          id: { tmdb: 1438 },
          type: 'show',
          watched_at: '2026-08-15T08:20:22.419Z',
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('history.json')]);

      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'show',
        ids: { tmdb: 1438 },
      });
    });

    it('coerces string numeric ids to numbers', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          tmdb_id: '67324',
          tvdb_id: '79126',
          trakt_id: '42',
          watched_at: '2026-08-14T10:47:49.000Z',
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('history.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]?.ids).toEqual({
        trakt: 42,
        imdb: undefined,
        tmdb: 67324,
        tvdb: 79126,
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

  describe('parse – numeric root id', () => {
    it('does not read ids off an export play id', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          id: 14292717085,
          type: 'movie',
          title: 'Upside Down',
          year: 2012,
          watched_at: '2026-08-18T01:18:00.000Z',
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('history.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'movie',
        title: 'Upside Down',
        year: 2012,
      });
      expect(result[0]?.ids).toEqual({
        trakt: undefined,
        imdb: undefined,
        tmdb: undefined,
        tvdb: undefined,
      });
    });
  });

  describe('parse – nested season entries', () => {
    it('uses the season ids, not the parent show ids', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          rated_at: '2025-09-29T21:35:25.000Z',
          rating: 7,
          type: 'season',
          season: {
            number: 1,
            ids: { trakt: 279654, tvdb: 1967072, tmdb: 219370 },
          },
          show: {
            title: 'Marvel Zombies',
            year: 2025,
            ids: { trakt: 191189, tvdb: 412428, imdb: 'tt16027014' },
          },
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('ratings.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'ratings',
        type: 'season',
        ids: { trakt: 279654, tvdb: 1967072, tmdb: 219370 },
        title: 'Marvel Zombies',
        year: 2025,
        season: 1,
        rating: 7,
      });
    });

    it('infers the season type from a nested season object', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          rating: 9,
          season: { number: 4, ids: { trakt: 432076 } },
          show: { title: 'The Bear', year: 2022, ids: { trakt: 1 } },
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('ratings.json')]);

      expect(result[0]).toMatchObject({
        type: 'season',
        ids: { trakt: 432076 },
      });
    });
  });

  describe('parse – multiple actions per entry', () => {
    it('fans out an entry carrying both a watch and a rating', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          tmdb_id: 1438,
          type: 'show',
          watched_at: '2026-08-11T07:22:04.000Z',
          rating: 8,
          rated_at: '2026-08-11T07:22:03.000Z',
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('history.json')]);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        expect.objectContaining({
          action: 'history',
          type: 'show',
          watched_at: '2026-08-11T07:22:04.000Z',
        }),
        expect.objectContaining({
          action: 'ratings',
          type: 'show',
          rating: 8,
        }),
      ]);
    });

    it('fans out the documented history, watchlist and rating example', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          imdb_id: 'tt0068646',
          type: 'movie',
          watched_at: '2024-10-25T20:00:00Z',
          watchlisted_at: '2024-10-01T10:00:00Z',
          rating: 6,
          rated_at: '2024-10-26T21:00:00Z',
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('export.json')]);

      expect(result.map((item) => item.action)).toEqual([
        'history',
        'ratings',
        'watchlist',
      ]);
    });

    it('keeps a single item when the action is explicit', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          imdb_id: 'tt0068646',
          action: 'ratings',
          watched_at: '2024-10-25T20:00:00Z',
          rating: 6,
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('ratings.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]?.action).toBe('ratings');
    });

    it('does not infer a watch from created_at alongside another action', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          imdb_id: 'tt0068646',
          is_watchlisted: true,
          created_at: '2024-10-01T10:00:00Z',
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('watchlist.json')]);

      expect(result).toHaveLength(1);
      expect(result[0]?.action).toBe('watchlist');
      expect(result[0]?.watched_at).toBeUndefined();
    });

    it('emits one item per action for a nested entry', async () => {
      mockParseJsonFile.mockResolvedValue([
        {
          watched_at: '2026-08-15T08:20:22.419Z',
          rating: 9,
          show: { title: 'The Wire', year: 2002, ids: { imdb: 'tt0306414' } },
        },
      ]);

      const result = await TraktJsonParser.parse([makeFile('export.json')]);

      expect(result.map((item) => item.action)).toEqual([
        'history',
        'ratings',
      ]);
      expect(result.every((item) => item.type === 'show')).toBe(true);
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

    it('parses history from an export using hyphenated file names', async () => {
      setupZip({
        'watched-history-1.json': [
          {
            watched_at: '2026-08-18T01:18:00.000Z',
            action: 'watch',
            type: 'movie',
            movie: { title: 'The Bounty', year: 1984, ids: { trakt: 1800 } },
          },
        ],
      });

      const result = await TraktJsonParser.parse([makeFile('export.zip')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ action: 'history', type: 'movie' });
    });

    it('parses ratings from an export using hyphenated file names', async () => {
      setupZip({
        'ratings-movies-1.json': [
          {
            rated_at: '2026-08-17T20:59:32.000Z',
            rating: 8,
            type: 'movie',
            movie: { title: 'The Bounty', year: 1984, ids: { trakt: 1800 } },
          },
        ],
      });

      const result = await TraktJsonParser.parse([makeFile('export.zip')]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ action: 'ratings', rating: 8 });
    });

    it('parses the watchlist from an export using hyphenated file names', async () => {
      setupZip({
        'lists-watchlist.json': [
          {
            listed_at: '2026-08-01T00:00:00.000Z',
            type: 'movie',
            movie: { title: 'Dune', year: 2021, ids: { trakt: 1 } },
          },
        ],
      });

      const result = await TraktJsonParser.parse([makeFile('export.zip')]);

      expect(result).toHaveLength(1);
      expect(result[0]?.action).toBe('watchlist');
    });

    it('parses a paginated watchlist from an export', async () => {
      setupZip({
        'lists-watchlist-1.json': [
          {
            listed_at: '2026-08-01T00:00:00.000Z',
            type: 'movie',
            movie: { title: 'Dune', year: 2021, ids: { trakt: 1 } },
          },
        ],
        'lists-watchlist-2.json': [
          {
            listed_at: '2026-08-02T00:00:00.000Z',
            type: 'movie',
            movie: { title: 'Heretic', year: 2024, ids: { trakt: 2 } },
          },
        ],
      });

      const result = await TraktJsonParser.parse([makeFile('export.zip')]);

      expect(result).toHaveLength(2);
      expect(result.every((item) => item.action === 'watchlist')).toBe(true);
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
