import { describe, expect, it } from 'vitest';
import { buildSearchIssue } from './buildSearchIssue.ts';

const baseInput = {
  reportId: 'abc-123',
  userId: '42',
  username: 'tester',
  query: 'dune',
  intent: 'dune 1984',
  expected: 'The 1984 David Lynch film',
  mode: 'movie',
  results: ['movie: Dune (2021) [dune-2021]', 'movie: Dune: Part Two (2024)'],
  storagePrefix: 'search/abc-123',
};

describe('util: buildSearchIssue', () => {
  it('should title the issue with the query and username', () => {
    expect(buildSearchIssue(baseInput).title).toBe('Search: "dune" - @tester');
  });

  it('should include the query, intent, mode and expectation', () => {
    const { body } = buildSearchIssue(baseInput);

    expect(body).toContain('**Search text:** `dune`');
    expect(body).toContain('**Looking for:** dune 1984');
    expect(body).toContain('**Mode:** movie');
    expect(body).toContain('The 1984 David Lynch film');
  });

  it('should number the results that were shown', () => {
    const { body } = buildSearchIssue(baseInput);

    expect(body).toContain('1. movie: Dune (2021) [dune-2021]');
    expect(body).toContain('2. movie: Dune: Part Two (2024)');
  });

  it('should say when no results were shown', () => {
    expect(buildSearchIssue({ ...baseInput, results: [] }).body).toContain(
      '(no results)',
    );
  });

  it('should tag the issue with the search-report label', () => {
    expect(buildSearchIssue(baseInput).labels).toEqual(['search-report']);
  });
});
