import { zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { TvTimeExportParser } from './TvTimeExportParser.ts';

const EPISODES_HEADER = [
  'series_tvdb_id',
  'series_imdb_id',
  'series_uuid',
  'title',
  'season',
  'episode',
  'tvdb_id',
  'is_watched',
  'watched_at',
  'rewatch_count',
  'special',
];

const MOVIES_HEADER = [
  'uuid',
  'tvdb_id',
  'imdb_id',
  'title',
  'year',
  'created_at',
  'watched_at',
  'is_watched',
  'rewatch_count',
];

const SERIES_HEADER = [
  'uuid',
  'tvdb_id',
  'imdb_id',
  'title',
  'status',
  'created_at',
];

function toCsv(header: string[], rows: Record<string, string>[]): string {
  const lines = rows.map(
    (row) => header.map((column) => row[column] ?? '').join(','),
  );
  return [header.join(','), ...lines].join('\n');
}

function csvFile(content: string, name: string): File {
  return new File([content], name, { type: 'text/csv' });
}

const episodeRow = (overrides: Record<string, string> = {}) => ({
  series_tvdb_id: '346328',
  title: 'Elite',
  season: '1',
  episode: '1',
  tvdb_id: '6671792',
  is_watched: 'true',
  watched_at: '2019-10-04 03:43:42',
  ...overrides,
});

const movieRow = (overrides: Record<string, string> = {}) => ({
  tvdb_id: '1435',
  imdb_id: 'tt1396484',
  title: 'It',
  year: '2017',
  watched_at: '2019-09-10T08:01:29Z',
  is_watched: 'true',
  ...overrides,
});

describe('TvTimeExportParser', () => {
  describe('csv', () => {
    it('should import watched episodes with tvdb ids', async () => {
      const csv = toCsv(EPISODES_HEADER, [episodeRow()]);

      const result = await TvTimeExportParser.parse([
        csvFile(csv, 'tvtime-series-episodes-2026-07-05.csv'),
      ]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'episode',
        ids: { tvdb: 6671792 },
        title: 'Elite',
        season: 1,
        episode: 1,
      });
      expect(result[0]?.watched_at).toBeDefined();
    });

    it('should skip unwatched episodes', async () => {
      const csv = toCsv(EPISODES_HEADER, [episodeRow({ is_watched: 'false' })]);

      const result = await TvTimeExportParser.parse([
        csvFile(csv, 'tvtime-series-episodes-2026-07-05.csv'),
      ]);

      expect(result).toHaveLength(0);
    });

    it('should import watched movies with tvdb and imdb ids', async () => {
      const csv = toCsv(MOVIES_HEADER, [movieRow()]);

      const result = await TvTimeExportParser.parse([
        csvFile(csv, 'tvtime-movies-2026-07-05.csv'),
      ]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'movie',
        ids: { tvdb: 1435, imdb: 'tt1396484' },
        title: 'It',
        year: 2017,
      });
    });

    it('should watchlist only not-started-yet series', async () => {
      const csv = toCsv(SERIES_HEADER, [
        {
          tvdb_id: '111',
          imdb_id: '',
          title: 'Wanted',
          status: 'not_started_yet',
        },
        {
          tvdb_id: '222',
          imdb_id: '',
          title: 'Watching',
          status: 'continuing',
        },
        { tvdb_id: '333', imdb_id: '', title: 'Done', status: 'up_to_date' },
      ]);

      const result = await TvTimeExportParser.parse([
        csvFile(csv, 'tvtime-series-2026-07-05.csv'),
      ]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'watchlist',
        type: 'show',
        ids: { tvdb: 111 },
        title: 'Wanted',
      });
    });

    it('should ignore custom list files', async () => {
      const csv =
        'list_id,list_name,item_type,tvdb_id,uuid,name,custom_order\n' +
        '1,Favs,series,346328,uuid,Elite,0';

      const result = await TvTimeExportParser.parse([
        csvFile(csv, 'tvtime-lists-2026-07-05.csv'),
      ]);

      expect(result).toHaveLength(0);
    });
  });

  describe('zip', () => {
    it('should parse tvtime csv files from a zip', async () => {
      const encoder = new TextEncoder();
      const zipped = zipSync({
        'tvtime-series-episodes-2026-07-07.csv': encoder.encode(
          toCsv(EPISODES_HEADER, [episodeRow()]),
        ),
        'tvtime-movies-2026-07-07.csv': encoder.encode(
          toCsv(MOVIES_HEADER, [movieRow()]),
        ),
        'tvtime-summary-2026-07-07.html': encoder.encode('<html></html>'),
      });

      const result = await TvTimeExportParser.parse([
        new File([zipped as BlobPart], 'tvtime-export-2026-07-07.zip'),
      ]);

      expect(result.filter((item) => item.type === 'episode')).toHaveLength(1);
      expect(result.filter((item) => item.type === 'movie')).toHaveLength(1);
    });
  });

  describe('json', () => {
    it('should import watched episodes nested in the series json', async () => {
      const shows = [{
        id: { tvdb: 346328, imdb: null },
        title: 'Elite',
        status: 'continuing',
        seasons: [{
          number: 1,
          episodes: [
            {
              id: { tvdb: 6671792 },
              number: 1,
              is_watched: true,
              watched_at: '2019-10-04T03:43:42Z',
            },
            { id: { tvdb: 6671793 }, number: 2, is_watched: false },
          ],
        }],
      }];

      const result = await TvTimeExportParser.parse([
        new File([JSON.stringify(shows)], 'tvtime-series-2026-07-07.json'),
      ]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'episode',
        ids: { tvdb: 6671792 },
        title: 'Elite',
        season: 1,
        episode: 1,
      });
    });

    it('should import watched movies from the movies json', async () => {
      const movies = [
        {
          id: { tvdb: 1435, imdb: 'tt1396484' },
          title: 'It',
          year: 2017,
          is_watched: true,
          watched_at: '2019-09-10T08:01:29Z',
        },
        { id: { tvdb: 99 }, title: 'Unwatched', is_watched: false },
      ];

      const result = await TvTimeExportParser.parse([
        new File([JSON.stringify(movies)], 'tvtime-movies-2026-07-07.json'),
      ]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        type: 'movie',
        ids: { tvdb: 1435, imdb: 'tt1396484' },
      });
    });
  });

  describe('mixed csv + json upload', () => {
    it('should de-duplicate watches present in both formats', async () => {
      const encoder = new TextEncoder();
      const csvZip = zipSync({
        'tvtime-series-episodes-2026-07-07.csv': encoder.encode(
          toCsv(EPISODES_HEADER, [episodeRow()]),
        ),
      });
      const shows = [{
        id: { tvdb: 346328 },
        title: 'Elite',
        status: 'continuing',
        seasons: [{
          number: 1,
          episodes: [{ id: { tvdb: 6671792 }, number: 1, is_watched: true }],
        }],
      }];
      const jsonZip = zipSync({
        'tvtime-series-2026-07-07.json': encoder.encode(JSON.stringify(shows)),
      });

      const result = await TvTimeExportParser.parse([
        new File([csvZip as BlobPart], 'tvtime-export-2026-07-07 (1).zip'),
        new File([jsonZip as BlobPart], 'tvtime-export-2026-07-07 (2).zip'),
      ]);

      expect(result.filter((item) => item.type === 'episode')).toHaveLength(1);
    });

    it('should keep items only one format carries', async () => {
      const encoder = new TextEncoder();
      const csvZip = zipSync({
        'tvtime-series-episodes-2026-07-07.csv': encoder.encode(
          toCsv(EPISODES_HEADER, [episodeRow()]),
        ),
      });
      // The JSON series export also carries the watchlist (not-started shows),
      // which the episodes CSV does not. It must survive the merge.
      const shows = [{
        id: { tvdb: 111 },
        title: 'Wanted',
        status: 'not_started_yet',
        seasons: [],
      }];
      const jsonZip = zipSync({
        'tvtime-series-2026-07-07.json': encoder.encode(JSON.stringify(shows)),
      });

      const result = await TvTimeExportParser.parse([
        new File([csvZip as BlobPart], 'tvtime-export-2026-07-07 (1).zip'),
        new File([jsonZip as BlobPart], 'tvtime-export-2026-07-07 (2).zip'),
      ]);

      expect(result.filter((item) => item.type === 'episode')).toHaveLength(1);
      expect(result).toContainEqual(
        expect.objectContaining({
          action: 'watchlist',
          type: 'show',
          ids: { tvdb: 111, imdb: undefined },
        }),
      );
    });

    it('should keep the watched_at from whichever format carries it', async () => {
      const encoder = new TextEncoder();
      // Same episode, but only the JSON export carries the timestamp.
      const csvZip = zipSync({
        'tvtime-series-episodes-2026-07-07.csv': encoder.encode(
          toCsv(EPISODES_HEADER, [episodeRow({ watched_at: '' })]),
        ),
      });
      const shows = [{
        id: { tvdb: 346328 },
        title: 'Elite',
        status: 'continuing',
        seasons: [{
          number: 1,
          episodes: [{
            id: { tvdb: 6671792 },
            number: 1,
            is_watched: true,
            watched_at: '2019-10-04T03:43:42Z',
          }],
        }],
      }];
      const jsonZip = zipSync({
        'tvtime-series-2026-07-07.json': encoder.encode(JSON.stringify(shows)),
      });

      const result = await TvTimeExportParser.parse([
        new File([csvZip as BlobPart], 'tvtime-export-2026-07-07 (1).zip'),
        new File([jsonZip as BlobPart], 'tvtime-export-2026-07-07 (2).zip'),
      ]);

      expect(result).toHaveLength(1);
      expect(result[0]?.watched_at).toBeDefined();
    });
  });
});
