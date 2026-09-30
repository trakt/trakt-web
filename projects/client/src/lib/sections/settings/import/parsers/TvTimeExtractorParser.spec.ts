import { zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { TvTimeExtractorParser } from './TvTimeExtractorParser.ts';

const EXTRACTOR_CSV = [
  'type,media_type,tmdb_id,imdb_id,tvdb_id,title,year,season,episode,watched_at,rating,review',
  'watch,movie,,tt0163025,,Jurassic Park III,2001,,,2019-10-21T06:31:39Z,,',
  'watch,movie,,,,Take Ball Pass Ball,2018,,,2019-10-21T06:17:23Z,,',
  'watch,movie,,,,No Year,,,,2019-10-21T06:17:23Z,,',
  "watch,episode,,,,Abdeen's Palace,,1,10,2016-11-06T18:52:32Z,,",
].join('\n');

function csvFile(content: string, name = 'tv-time-export.csv'): File {
  return new File([content], name, { type: 'text/csv' });
}

describe('TvTimeExtractorParser', () => {
  describe('canParse', () => {
    it('should accept a single csv or zip file', () => {
      expect(TvTimeExtractorParser.canParse([csvFile('')])).toBe(true);
      expect(
        TvTimeExtractorParser.canParse([new File([''], 'tv-time-export.zip')]),
      ).toBe(true);
    });

    it('should reject multiple files', () => {
      expect(TvTimeExtractorParser.canParse([csvFile(''), csvFile('')]))
        .toBe(false);
    });
  });

  describe('parse', () => {
    it('should add watched movies to history', async () => {
      const result = await TvTimeExtractorParser.parse([
        csvFile(EXTRACTOR_CSV),
      ]);

      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'movie',
        ids: { imdb: 'tt0163025' },
        title: 'Jurassic Park III',
        year: 2001,
        watched_at: '2019-10-21T06:31:39.000Z',
      });
    });

    it('should keep movies without ids for title and year resolution', async () => {
      const result = await TvTimeExtractorParser.parse([
        csvFile(EXTRACTOR_CSV),
      ]);

      expect(result[1]).toMatchObject({
        title: 'Take Ball Pass Ball',
        year: 2018,
      });
    });

    it('should skip movies without ids or year, and id-less episodes', async () => {
      const result = await TvTimeExtractorParser.parse([
        csvFile(EXTRACTOR_CSV),
      ]);

      expect(result).toHaveLength(2);
    });

    it('should read the csv from a zip', async () => {
      const zipped = zipSync({
        'tv-time-export.csv': new TextEncoder().encode(EXTRACTOR_CSV),
      });

      const result = await TvTimeExtractorParser.parse([
        new File([zipped as BlobPart], 'tv-time-export.zip'),
      ]);

      expect(result).toHaveLength(2);
    });
  });
});
