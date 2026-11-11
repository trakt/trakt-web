import { describe, expect, it } from 'vitest';
import { toReportRecord } from './toReportRecord.ts';

const reporter = { userId: '1', username: 'tester', isVip: true };
const createdAt = '2026-11-11T00:00:00.000Z';

describe('util: toReportRecord', () => {
  it('should store import files under the source and report id', () => {
    const file = new File(['a'], 'my/ratings.csv');
    const record = toReportRecord({
      reportId: 'r1',
      createdAt,
      report: {
        ...reporter,
        kind: 'import',
        source: 'letterboxd',
        sourceName: 'Letterboxd',
        message: 'Missing films',
        files: [file],
      },
    });

    expect(record.storagePrefix).toBe('letterboxd/r1');
    expect(record.files.map(({ key }) => key)).toEqual([
      'letterboxd/r1/ratings.csv',
    ]);
    expect(record.meta.files).toEqual([{ name: 'ratings.csv', size: 1 }]);
    expect(record.issue.labels).toEqual(['import-report', 'letterboxd']);
  });

  it('should keep an upload named report.json apart from the metadata', () => {
    const record = toReportRecord({
      reportId: 'r3',
      createdAt,
      report: {
        ...reporter,
        kind: 'import',
        source: 'trakt-json',
        sourceName: 'Trakt JSON',
        message: 'Missing history',
        files: [new File(['a'], 'report.json')],
      },
    });

    expect(record.metaKey).toBe('trakt-json/r3/report.json');
    expect(record.files.map(({ key }) => key)).toEqual([
      'trakt-json/r3/upload-report.json',
    ]);
    expect(record.meta.files).toEqual([
      { name: 'upload-report.json', size: 1 },
    ]);
  });

  it('should store a search report without files', () => {
    const record = toReportRecord({
      reportId: 'r2',
      createdAt,
      report: {
        ...reporter,
        kind: 'search',
        query: 'dune',
        intent: 'dune',
        link: 'https://www.imdb.com/title/tt0087182/',
        expected: 'Dune (1984)',
        mode: 'movie',
        results: [],
      },
    });

    expect(record.storagePrefix).toBe('search/r2');
    expect(record.files).toEqual([]);
    expect(record.meta).toMatchObject({ reportId: 'r2', query: 'dune' });
    expect(record.issue.labels).toEqual(['search-report']);
  });
});
