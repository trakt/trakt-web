import { zipSync } from 'fflate';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { UniversalImportItem } from '../ImportTypes.ts';
import { TvTimeCsvParser } from './TvTimeCsvParser.ts';

// Coverage against REAL TV Time exports (anonymized: user_id/uuid/gsi and
// timestamp maps scrubbed, public TVDB/IMDb ids + titles kept, rows sampled to
// cover every parser branch). Fixtures were captured from actual failed-import
// reports; see __fixtures__/tvtime/README.md for provenance + the anonymizer.
// These guard against real-world column-shape drift that hand-written mocks
// missed - the original v2 bug (episode_id vs ep_id) passed unit tests because
// the mock fabricated a column the real export never had.

const FIXTURE_DIR = join(import.meta.dirname, '__fixtures__/tvtime');

function fixture(name: string): string {
  return readFileSync(join(FIXTURE_DIR, name), 'utf-8');
}

// fixtureName is the on-disk file; uploadName is what the real upload is called
// (drives format detection), defaulting to the fixture name when they match.
function csvFile(fixtureName: string, uploadName = fixtureName): File {
  return new File([fixture(fixtureName)], uploadName, { type: 'text/csv' });
}

function jsonFile(name: string): File {
  return new File([fixture(name)], name, { type: 'application/json' });
}

function tally(items: readonly UniversalImportItem[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const item of items) {
    const key = `${item.action}:${item.type}`;
    out[key] = (out[key] ?? 0) + 1;
  }
  return out;
}

function zipFixtures(names: string[], zipName: string): File {
  const encoder = new TextEncoder();
  const entries = Object.fromEntries(
    names.map((name) => [name, encoder.encode(fixture(name))]),
  );
  return new File([zipSync(entries) as BlobPart], zipName);
}

describe('TvTimeCsvParser: real anonymized exports', () => {
  it('imports a real GDPR v2 tracking file (ep_id episodes + watchlist)', async () => {
    const result = await TvTimeCsvParser.parse([
      csvFile(
        'gdpr-v2-tracking-prod-records-v2.csv',
        'tracking-prod-records-v2.csv',
      ),
    ]);

    expect(tally(result)).toEqual({
      'history:episode': 8,
      'watchlist:show': 1,
    });
    // Every parsed item must resolve to a TVDB id - the v2 bug produced items
    // with no id (or none at all).
    expect(result.every((item) => item.ids.tvdb != null)).toBe(true);
  });

  it('imports a real current-format export from loose tvtime-*.csv files', async () => {
    const result = await TvTimeCsvParser.parse([
      csvFile('tvtime-series-episodes.csv'),
      csvFile('tvtime-movies.csv'),
      csvFile('tvtime-series.csv'),
    ]);

    expect(tally(result)).toEqual({
      'history:episode': 7,
      'history:movie': 4,
      'watchlist:show': 1,
    });
    expect(result.every((item) => item.ids.tvdb != null)).toBe(true);
  });

  it('imports a real current-format export from a tvtime-export zip', async () => {
    const zip = zipFixtures([
      'tvtime-series-episodes.csv',
      'tvtime-movies.csv',
      'tvtime-series.csv',
    ], 'tvtime-export-2026-07-05.zip');

    const result = await TvTimeCsvParser.parse([zip]);

    expect(tally(result)).toEqual({
      'history:episode': 7,
      'history:movie': 4,
      'watchlist:show': 1,
    });
  });

  it('imports a real current-format export from the JSON serialization', async () => {
    const result = await TvTimeCsvParser.parse([
      jsonFile('tvtime-series.json'),
      jsonFile('tvtime-movies.json'),
    ]);

    expect(tally(result)).toEqual({
      'history:episode': 2,
      'history:movie': 3,
    });
    expect(result.every((item) => item.ids.tvdb != null)).toBe(true);
  });

  it('merges a real CSV zip and JSON zip uploaded together', async () => {
    const csvZip = zipFixtures(
      ['tvtime-series-episodes.csv', 'tvtime-movies.csv'],
      'tvtime-export-2026-07-05 (1).zip',
    );
    const jsonZip = zipFixtures(
      ['tvtime-series.json', 'tvtime-movies.json'],
      'tvtime-export-2026-07-05 (2).zip',
    );

    const result = await TvTimeCsvParser.parse([csvZip, jsonZip]);

    // These two fixtures come from different real exports (no overlapping
    // watches), so the union is their sum: 7+2 episodes, 4+3 movies. The
    // same-account de-dup guarantee is covered in TvTimeExportParser.spec.ts.
    expect(tally(result)).toEqual({
      'history:episode': 9,
      'history:movie': 7,
    });
    expect(result.every((item) => item.ids.tvdb != null)).toBe(true);
  });
});
