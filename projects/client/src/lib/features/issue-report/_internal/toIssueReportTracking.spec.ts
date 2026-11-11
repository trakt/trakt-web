import { describe, expect, it } from 'vitest';
import { toIssueReportTracking } from './toIssueReportTracking.ts';

describe('util: toIssueReportTracking', () => {
  it('should track an import report by its source', () => {
    expect(
      toIssueReportTracking({
        kind: 'import',
        source: 'imdb',
        sourceName: 'IMDb',
        message: 'free text stays out',
        files: [],
      }),
    ).toEqual({ kind: 'import', source: 'imdb' });
  });

  it('should track a search report by its mode and never the query', () => {
    expect(
      toIssueReportTracking({
        kind: 'search',
        query: 'private query',
        intent: 'private intent',
        expected: 'free text',
        mode: 'people',
        results: [],
      }),
    ).toEqual({ kind: 'search', source: 'people' });
  });
});
