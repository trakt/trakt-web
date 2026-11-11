import { describe, expect, it } from 'vitest';
import { validateSearchReport } from './validateSearchReport.ts';

const baseInput = {
  query: 'dune',
  intent: 'dune 1984',
  expected: 'The 1984 David Lynch film',
  results: ['movie: Dune (2021)'],
};

describe('util: validateSearchReport', () => {
  it('should accept a query with an expectation', () => {
    expect(validateSearchReport(baseInput)).toEqual({ ok: true });
  });

  it('should accept a report with no results', () => {
    expect(validateSearchReport({ ...baseInput, results: [] })).toEqual({
      ok: true,
    });
  });

  it('should reject a blank query', () => {
    expect(validateSearchReport({ ...baseInput, query: '  ' })).toEqual({
      ok: false,
      reason: 'query-required',
    });
  });

  it('should reject a blank intent', () => {
    expect(validateSearchReport({ ...baseInput, intent: ' ' })).toEqual({
      ok: false,
      reason: 'intent-required',
    });
  });

  it('should reject a blank expectation', () => {
    expect(validateSearchReport({ ...baseInput, expected: '' })).toEqual({
      ok: false,
      reason: 'expected-required',
    });
  });

  it('should reject more than 20 results', () => {
    const results = Array.from({ length: 21 }, (_, index) => `item ${index}`);

    expect(validateSearchReport({ ...baseInput, results })).toEqual({
      ok: false,
      reason: 'too-many-results',
    });
  });
});
