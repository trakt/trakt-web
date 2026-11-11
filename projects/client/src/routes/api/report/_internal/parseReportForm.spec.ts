import { describe, expect, it } from 'vitest';
import { parseReportForm } from './parseReportForm.ts';

const formOf = (entries: ReadonlyArray<[string, string | File]>): FormData =>
  entries.reduce((form, [key, value]) => {
    form.append(key, value);
    return form;
  }, new FormData());

const reporter = { userId: '1', username: 'tester', isVip: true };

describe('util: parseReportForm', () => {
  it('should parse an import report with its files', () => {
    const file = new File(['a'], 'ratings.csv');
    const report = parseReportForm(
      formOf([
        ['kind', 'import'],
        ['source', 'Letterboxd!'],
        ['sourceName', 'Letterboxd'],
        ['message', 'Missing films'],
        ['files', file],
      ]),
      reporter,
    );

    expect(report).toEqual({
      kind: 'import',
      source: 'letterboxd',
      sourceName: 'Letterboxd',
      message: 'Missing films',
      ...reporter,
      files: [expect.any(File)],
    });
  });

  it('should parse a search report with its results in order', () => {
    const report = parseReportForm(
      formOf([
        ['kind', 'search'],
        ['query', 'dune'],
        ['intent', 'dune 1984'],
        ['link', ' https://www.imdb.com/title/tt0087182/ '],
        ['expected', 'Dune (1984)'],
        ['mode', 'movie'],
        ['results', 'movie: Dune: Part Two (2024)'],
        ['results', 'movie: Dune (2021)'],
      ]),
      reporter,
    );

    expect(report).toEqual({
      kind: 'search',
      query: 'dune',
      intent: 'dune 1984',
      link: 'https://www.imdb.com/title/tt0087182/',
      expected: 'Dune (1984)',
      mode: 'movie',
      ...reporter,
      results: ['movie: Dune: Part Two (2024)', 'movie: Dune (2021)'],
    });
  });

  it('should reject an unknown kind', () => {
    expect(parseReportForm(formOf([['kind', 'comment']]), reporter)).toBeNull();
  });
});
