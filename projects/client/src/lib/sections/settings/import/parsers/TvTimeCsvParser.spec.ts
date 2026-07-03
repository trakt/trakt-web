import { zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { TvTimeCsvParser } from './TvTimeCsvParser.ts';

const LIBERATOR_CSV = [
  'imdb_id,tvdb_id,type,title,season,episode,is_special,is_watched,watched_at,status,is_watchlisted,rating',
  'tt0903747,3859781,episode,Breaking Bad,3,7,false,true,2023-06-01T12:00:00Z,ended,false',
].join('\n');

const NATIVE_CSV = [
  'ts,show_name,episode_id,episode_season_number,episode_number,episode_name',
  '1685620800,Breaking Bad,4325452,3,8,I See You',
].join('\n');

const GDPR_V2_CSV = [
  'ep_watch_count,updated_at,key,user_id,created_at,is_archived,is_for_later,s_id,series_name,is_followed,ep_no,ep_id,episode_number,rewatch_count,s_no,is_unitary,episode_id,season_number,gsi,is_special',
  ',2021-10-10 11:49:11,watch-episode-02531a20-021e25cc,1,2021-10-10 11:49:11,,,82066,Fringe,,10,1331151,10,0,2,false,1331151,2,,',
].join('\n');

function csvFile(content: string, name: string): File {
  return new File([content], name, { type: 'text/csv' });
}

function zipFile(entries: Record<string, string>, name: string): File {
  const encoder = new TextEncoder();
  const zipped = zipSync(
    Object.fromEntries(
      Object.entries(entries).map(([path, content]) => [
        path,
        encoder.encode(content),
      ]),
    ),
  );
  return new File([zipped as BlobPart], name);
}

describe('TvTimeCsvParser', () => {
  describe('canParse', () => {
    it('should accept csv and zip files', () => {
      expect(TvTimeCsvParser.canParse([
        csvFile('', 'liberator.csv'),
        csvFile('', 'tracking-prod-records.csv'),
        new File([''], 'gdpr-data.zip'),
      ])).toBe(true);
    });

    it('should reject unsupported file types', () => {
      expect(TvTimeCsvParser.canParse([new File([''], 'data.json')])).toBe(
        false,
      );
    });

    it('should reject an empty file list', () => {
      expect(TvTimeCsvParser.canParse([])).toBe(false);
    });
  });

  describe('format dispatch', () => {
    it('should route liberator files by their imdb_id column', async () => {
      const result = await TvTimeCsvParser.parse([
        csvFile(LIBERATOR_CSV, 'tv-time-liberator.csv'),
      ]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'episode',
        ids: { imdb: 'tt0903747', tvdb: 3859781 },
        title: 'Breaking Bad',
      });
    });

    it('should route gdpr tracking files by their ep_id column', async () => {
      const result = await TvTimeCsvParser.parse([
        csvFile(GDPR_V2_CSV, 'tracking-prod-records-v2.csv'),
      ]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'episode',
        ids: { tvdb: 1331151 },
        title: 'Fringe',
        season: 2,
        episode: 10,
      });
    });

    it('should route followed show files by their notification_offset column', async () => {
      const followedCsv = [
        'user_id,tv_show_id,notification_type,notification_offset,created_at,updated_at,active,diffusion,folder_id,archived,tv_show_name',
        '1,357864,2,1440,2021-03-15 20:42:59,2021-03-15 20:42:59,0,original,,0,Lovecraft Country',
      ].join('\n');

      const result = await TvTimeCsvParser.parse([
        csvFile(followedCsv, 'followed_tv_show.csv'),
      ]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'watchlist',
        type: 'show',
        ids: { tvdb: 357864 },
      });
    });

    it('should route remaining csv files to the native parser', async () => {
      const result = await TvTimeCsvParser.parse([
        csvFile(NATIVE_CSV, 'seen_episode.csv'),
      ]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'episode',
        ids: { tvdb: 4325452 },
        title: 'Breaking Bad',
      });
    });

    it('should return an empty array when no files are provided', async () => {
      const result = await TvTimeCsvParser.parse([]);
      expect(result).toHaveLength(0);
    });

    it('should route liberator zips by their activity_history.csv entry', async () => {
      const file = zipFile(
        { 'activity_history.csv': LIBERATOR_CSV },
        'tv-time-export.zip',
      );

      const result = await TvTimeCsvParser.parse([file]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'episode',
        ids: { imdb: 'tt0903747', tvdb: 3859781 },
        title: 'Breaking Bad',
      });
    });

    it('should route gdpr zips by their tracking-prod-records entries', async () => {
      const file = zipFile(
        {
          'gdpr-data/tracking-prod-records-v2.csv': GDPR_V2_CSV,
          'gdpr-data/ip_address.csv': 'ip\n127.0.0.1',
        },
        'gdpr-data.zip',
      );

      const result = await TvTimeCsvParser.parse([file]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'episode',
        ids: { tvdb: 1331151 },
      });
    });

    it('should reject zips that match no known TV Time export', async () => {
      const file = zipFile(
        { 'random.csv': 'a,b\n1,2' },
        'unknown.zip',
      );

      await expect(TvTimeCsvParser.parse([file])).rejects.toThrow(
        /does not look like a TV Time export/,
      );
    });

    it('should raise a helpful error for unreadable zips', async () => {
      const file = new File(
        [new Uint8Array([1, 2, 3, 4]) as BlobPart],
        'gdpr-data.zip',
      );

      await expect(TvTimeCsvParser.parse([file])).rejects.toThrow(
        /Could not read the .zip file/,
      );
    });
  });

  describe('whole-folder drops', () => {
    it('should ignore unrecognized noise files next to gdpr data', async () => {
      const result = await TvTimeCsvParser.parse([
        csvFile('device_id,device_type\nabc,ios', 'device_data.csv'),
        csvFile(
          'user_id,tv_show_id,episode_id,created_at,updated_at,tv_show_name\n1,82066,1331151,2021-10-10,2021-10-10,Fringe',
          'show_seen_episode_latest.csv',
        ),
        csvFile(GDPR_V2_CSV, 'tracking-prod-records-v2.csv'),
      ]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'episode',
        ids: { tvdb: 1331151 },
      });
    });

    it('should ignore json sidecars next to liberator csv files', async () => {
      const result = await TvTimeCsvParser.parse([
        new File(['[{"title":"Inception"}]'], 'movies.json'),
        csvFile(LIBERATOR_CSV, 'activity_history.csv'),
      ]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'episode',
        ids: { imdb: 'tt0903747' },
      });
    });

    it('should reject uploads with no recognizable TV Time files', async () => {
      await expect(TvTimeCsvParser.parse([
        csvFile('device_id,device_type\nabc,ios', 'device_data.csv'),
        csvFile('', 'empty.csv'),
      ])).rejects.toThrow(/look like a TV Time export/);
    });
  });

  describe('mixed uploads', () => {
    it('should reject files from different export formats', async () => {
      await expect(TvTimeCsvParser.parse([
        csvFile(LIBERATOR_CSV, 'tv-time-liberator.csv'),
        csvFile(GDPR_V2_CSV, 'tracking-prod-records-v2.csv'),
      ])).rejects.toThrow(/not both at once/);
    });

    it('should parse both gdpr tracking files as one export', async () => {
      const gdprV1Csv = [
        'watch_count,uuid,type,series_name,type-uuid-n,updated_at,user_id,created_at,series_id,watches,runtime,release_date_range_key,release_date,alpha_range_key,movie_name,entity_type,follow_date_range_key,rewatch_count,watch_date,series_uuid,season_number,episode_number,episode_id,watch_date_range_key,country',
        ',002e2d8f,watch,,watch-002e2d8f-0,2022-04-10 11:26:55,1,2022-04-10 11:26:55,,,,,2017-10-12,watch-alpha-what-happened-to-monday,What Happened to Monday,movie,,,,,,,,watch-date-1649590015,NL',
      ].join('\n');

      const result = await TvTimeCsvParser.parse([
        csvFile(gdprV1Csv, 'tracking-prod-records.csv'),
        csvFile(GDPR_V2_CSV, 'tracking-prod-records-v2.csv'),
      ]);

      expect(result.filter((item) => item.type === 'episode')).toHaveLength(1);
      expect(result.filter((item) => item.type === 'movie')).toHaveLength(1);
    });
  });
});
