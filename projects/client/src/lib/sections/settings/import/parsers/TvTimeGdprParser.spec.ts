import { zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { TvTimeGdprParser } from './TvTimeGdprParser.ts';

const V1_HEADER = [
  'watch_count',
  'uuid',
  'type',
  'series_name',
  'type-uuid-n',
  'updated_at',
  'user_id',
  'created_at',
  'series_id',
  'watches',
  'runtime',
  'release_date_range_key',
  'release_date',
  'alpha_range_key',
  'movie_name',
  'entity_type',
  'follow_date_range_key',
  'rewatch_count',
  'watch_date',
  'series_uuid',
  'season_number',
  'episode_number',
  'episode_id',
  'total_movies_runtime',
  'total_series_runtime',
  'unitarian',
  'watched_episode_range_key',
  'bulk_type',
  'watch_date_range_key',
  'country',
];

const V2_HEADER = [
  'ep_watch_count',
  'updated_at',
  'key',
  'movie_watch_count',
  'total_movies_runtime',
  'series_follow_count',
  'user_id',
  'created_at',
  'total_series_runtime',
  'is_archived',
  'is_for_later',
  's_id',
  'series_name',
  'is_followed',
  'uuid',
  'most_recent_ep_watched',
  'followed_at',
  'ep_no',
  'ep_id',
  'episode_number',
  'rewatch_count',
  's_no',
  'is_unitary',
  'episode_id',
  'season_number',
  'gsi',
  'runtime',
  'bulk_type',
  'is_special',
];

function toCsv(
  header: string[],
  rows: Record<string, string>[],
): string {
  const lines = rows.map(
    (row) => header.map((column) => row[column] ?? '').join(','),
  );
  return [header.join(','), ...lines].join('\n');
}

function v1MovieWatch(
  overrides: Record<string, string> = {},
): Record<string, string> {
  return {
    uuid: '002e2d8f-aee0-40ce-aa39-1be952e2952a',
    type: 'watch',
    'type-uuid-n': 'watch-002e2d8f-aee0-40ce-aa39-1be952e2952a-0',
    created_at: '2022-04-10 11:26:55',
    release_date: '2017-10-12',
    alpha_range_key: 'watch-alpha-what-happened-to-monday',
    movie_name: 'What Happened to Monday',
    entity_type: 'movie',
    watch_date_range_key: 'watch-date-1649590015',
    ...overrides,
  };
}

function v2EpisodeWatch(
  overrides: Record<string, string> = {},
): Record<string, string> {
  return {
    key: 'watch-episode-02531a20-2745-4f3c-b0b0-25475135b863-021e25cc',
    created_at: '2021-10-10 11:49:11',
    s_id: '82066',
    series_name: 'Fringe',
    episode_id: '1331151',
    season_number: '2',
    episode_number: '10',
    ...overrides,
  };
}

function v2UserSeries(
  overrides: Record<string, string> = {},
): Record<string, string> {
  return {
    key: 'user-series-019541e5-a756-46b0-a130-edf8e8d45cd4',
    created_at: '2021-05-19 06:06:35',
    s_id: '353309',
    series_name: 'Haunted',
    is_archived: 'false',
    is_for_later: 'false',
    is_followed: 'false',
    ...overrides,
  };
}

function csvFile(content: string, name = 'tracking.csv'): File {
  return new File([content], name, { type: 'text/csv' });
}

describe('TvTimeGdprParser', () => {
  describe('canParse', () => {
    it('should accept csv and zip files', () => {
      expect(TvTimeGdprParser.canParse([
        csvFile('', 'tracking-prod-records.csv'),
        new File([''], 'gdpr-data.zip'),
      ])).toBe(true);
    });

    it('should reject unsupported file types', () => {
      expect(TvTimeGdprParser.canParse([new File([''], 'data.json')]))
        .toBe(false);
    });

    it('should reject an empty file list', () => {
      expect(TvTimeGdprParser.canParse([])).toBe(false);
    });
  });

  describe('v2 tracking file', () => {
    it('should add watched episodes to history with tvdb ids', async () => {
      const csv = toCsv(V2_HEADER, [v2EpisodeWatch()]);

      const result = await TvTimeGdprParser.parse([csvFile(csv)]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'episode',
        ids: { tvdb: 1331151 },
        title: 'Fringe',
        season: 2,
        episode: 10,
      });
      expect(result[0]?.watched_at).toBeDefined();
    });

    it('should skip episode rows without an episode id', async () => {
      const csv = toCsv(V2_HEADER, [v2EpisodeWatch({ episode_id: '' })]);

      const result = await TvTimeGdprParser.parse([csvFile(csv)]);

      expect(result).toHaveLength(0);
    });

    it('should watchlist shows marked for later', async () => {
      const csv = toCsv(V2_HEADER, [
        v2UserSeries({ is_for_later: 'true' }),
      ]);

      const result = await TvTimeGdprParser.parse([csvFile(csv)]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'watchlist',
        type: 'show',
        ids: { tvdb: 353309 },
        title: 'Haunted',
      });
    });

    it('should watchlist followed shows without watched episodes', async () => {
      const csv = toCsv(V2_HEADER, [
        v2UserSeries({ is_followed: 'true' }),
      ]);

      const result = await TvTimeGdprParser.parse([csvFile(csv)]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'watchlist',
        type: 'show',
        ids: { tvdb: 353309 },
      });
    });

    it('should not watchlist followed shows with watched episodes', async () => {
      const csv = toCsv(V2_HEADER, [
        v2UserSeries({ is_followed: 'true', s_id: '82066' }),
        v2EpisodeWatch(),
      ]);

      const result = await TvTimeGdprParser.parse([csvFile(csv)]);

      expect(result.filter((item) => item.action === 'watchlist'))
        .toHaveLength(0);
    });

    it('should not watchlist archived shows', async () => {
      const csv = toCsv(V2_HEADER, [
        v2UserSeries({ is_followed: 'true', is_archived: 'true' }),
      ]);

      const result = await TvTimeGdprParser.parse([csvFile(csv)]);

      expect(result).toHaveLength(0);
    });

    it('should ignore unfollowed shows and stats rows', async () => {
      const csv = toCsv(V2_HEADER, [
        v2UserSeries(),
        { key: 'tracking-stats', ep_watch_count: '3283' },
      ]);

      const result = await TvTimeGdprParser.parse([csvFile(csv)]);

      expect(result).toHaveLength(0);
    });
  });

  describe('v1 tracking file', () => {
    it('should add watched movies to history with title and year', async () => {
      const csv = toCsv(V1_HEADER, [v1MovieWatch()]);

      const result = await TvTimeGdprParser.parse([csvFile(csv)]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'movie',
        ids: {},
        title: 'what happened to monday',
        year: 2017,
        watched_at: new Date(1649590015 * 1000).toISOString(),
      });
    });

    it('should derive english titles from the alpha slug', async () => {
      const csv = toCsv(V1_HEADER, [v1MovieWatch({
        movie_name: '승리호',
        alpha_range_key: 'watch-alpha-space-sweepers',
      })]);

      const result = await TvTimeGdprParser.parse([csvFile(csv)]);

      expect(result[0]?.title).toBe('space sweepers');
    });

    it('should fall back to the movie name without an alpha slug', async () => {
      const csv = toCsv(V1_HEADER, [v1MovieWatch({ alpha_range_key: '' })]);

      const result = await TvTimeGdprParser.parse([csvFile(csv)]);

      expect(result[0]?.title).toBe('What Happened to Monday');
    });

    it('should watchlist movies marked to watch', async () => {
      const csv = toCsv(V1_HEADER, [v1MovieWatch({
        type: 'towatch',
        alpha_range_key: 'towatch-alpha-heretic',
        movie_name: 'Heretic',
        release_date: '2024-11-15',
        watch_date_range_key: '',
      })]);

      const result = await TvTimeGdprParser.parse([csvFile(csv)]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'watchlist',
        type: 'movie',
        title: 'heretic',
        year: 2024,
      });
    });

    it('should skip movies without a release year', async () => {
      const csv = toCsv(V1_HEADER, [v1MovieWatch({ release_date: '' })]);

      const result = await TvTimeGdprParser.parse([csvFile(csv)]);

      expect(result).toHaveLength(0);
    });

    it('should skip movies with a zero release date', async () => {
      const csv = toCsv(V1_HEADER, [
        v1MovieWatch({ release_date: '0001-01-01 00:00:00' }),
      ]);

      const result = await TvTimeGdprParser.parse([csvFile(csv)]);

      expect(result).toHaveLength(0);
    });

    it('should ignore movie follows and aggregate rows', async () => {
      const csv = toCsv(V1_HEADER, [
        v1MovieWatch({ type: 'follow', watch_date_range_key: '' }),
        {
          'type-uuid-n': 'count-watch-episode-series-02531a20',
          type: 'count-watch-episode-series',
          series_name: 'Fringe',
          watch_count: '100',
        },
      ]);

      const result = await TvTimeGdprParser.parse([csvFile(csv)]);

      expect(result).toHaveLength(0);
    });

    it('should add watched episodes to history when the v2 file is absent', async () => {
      const csv = toCsv(V1_HEADER, [{
        type: 'watch',
        'type-uuid-n': 'watch-00017ebf-719a-4773-b686-857d9d7042da-0',
        series_name: 'Sex Education',
        entity_type: 'episode',
        season_number: '3',
        episode_number: '6',
        episode_id: '8507465',
        watch_date_range_key: 'watch-date-1633560470',
      }]);

      const result = await TvTimeGdprParser.parse([csvFile(csv)]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'episode',
        ids: { tvdb: 8507465 },
        title: 'Sex Education',
        season: 3,
        episode: 6,
        watched_at: new Date(1633560470 * 1000).toISOString(),
      });
    });

    it('should prefer v2 episodes over v1 episodes when both are present', async () => {
      const v1Csv = toCsv(V1_HEADER, [{
        type: 'watch',
        'type-uuid-n': 'watch-00017ebf-0',
        entity_type: 'episode',
        episode_id: '8507465',
      }]);
      const v2Csv = toCsv(V2_HEADER, [v2EpisodeWatch()]);

      const result = await TvTimeGdprParser.parse([
        csvFile(v1Csv, 'tracking-prod-records.csv'),
        csvFile(v2Csv, 'tracking-prod-records-v2.csv'),
      ]);

      const episodes = result.filter((item) => item.type === 'episode');
      expect(episodes).toHaveLength(1);
      expect(episodes[0]?.ids.tvdb).toBe(1331151);
    });

    it('should import movies alongside v2 episodes', async () => {
      const v1Csv = toCsv(V1_HEADER, [v1MovieWatch()]);
      const v2Csv = toCsv(V2_HEADER, [v2EpisodeWatch()]);

      const result = await TvTimeGdprParser.parse([
        csvFile(v1Csv, 'tracking-prod-records.csv'),
        csvFile(v2Csv, 'tracking-prod-records-v2.csv'),
      ]);

      expect(result.filter((item) => item.type === 'movie')).toHaveLength(1);
      expect(result.filter((item) => item.type === 'episode')).toHaveLength(1);
    });
  });

  describe('zip archives', () => {
    it('should parse tracking files from a gdpr zip', async () => {
      const encoder = new TextEncoder();
      const zipped = zipSync({
        'gdpr-data/tracking-prod-records.csv': encoder.encode(
          toCsv(V1_HEADER, [v1MovieWatch()]),
        ),
        'gdpr-data/tracking-prod-records-v2.csv': encoder.encode(
          toCsv(V2_HEADER, [v2EpisodeWatch()]),
        ),
        'gdpr-data/ip_address.csv': encoder.encode('ip\n127.0.0.1'),
      });
      const file = new File([zipped as BlobPart], 'gdpr-data.zip');

      const result = await TvTimeGdprParser.parse([file]);

      expect(result.filter((item) => item.type === 'movie')).toHaveLength(1);
      expect(result.filter((item) => item.type === 'episode')).toHaveLength(1);
    });

    it('should raise a helpful error for unreadable zips', async () => {
      const file = new File(
        [new Uint8Array([1, 2, 3, 4]) as BlobPart],
        'gdpr-data.zip',
      );

      await expect(TvTimeGdprParser.parse([file])).rejects.toThrow(
        /password protected/,
      );
    });
  });
});
