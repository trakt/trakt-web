import { describe, expect, it } from 'vitest';
import { toIssueReportFormData } from './toIssueReportFormData.ts';

describe('util: toIssueReportFormData', () => {
  it('should carry an import report with its files', () => {
    const file = new File(['a'], 'ratings.csv');
    const form = toIssueReportFormData({
      kind: 'import',
      source: 'letterboxd',
      sourceName: 'Letterboxd',
      message: 'Missing films',
      files: [file],
    });

    expect(form.get('kind')).toBe('import');
    expect(form.get('source')).toBe('letterboxd');
    expect(form.get('message')).toBe('Missing films');
    expect(form.has('username')).toBe(false);
    expect(form.getAll('files')).toHaveLength(1);
  });

  it('should carry a search report with every result in order', () => {
    const form = toIssueReportFormData({
      kind: 'search',
      query: 'dune',
      intent: 'dune 1984',
      link: 'https://www.imdb.com/title/tt0087182/',
      expected: 'Dune (1984)',
      mode: 'movie',
      results: ['movie: Dune (2021)', 'movie: Dune: Part Two (2024)'],
    });

    expect(form.get('kind')).toBe('search');
    expect(form.get('query')).toBe('dune');
    expect(form.get('intent')).toBe('dune 1984');
    expect(form.get('link')).toBe('https://www.imdb.com/title/tt0087182/');
    expect(form.get('expected')).toBe('Dune (1984)');
    expect(form.getAll('results')).toEqual([
      'movie: Dune (2021)',
      'movie: Dune: Part Two (2024)',
    ]);
  });
});
