import { describe, expect, it } from 'vitest';
import { toImportIds } from './toImportIds.ts';

describe('util: toImportIds', () => {
  it('should keep numeric ids as numbers', () => {
    expect(toImportIds({ trakt: 1, tmdb: 1438, tvdb: 79126 })).toEqual({
      trakt: 1,
      imdb: undefined,
      tmdb: 1438,
      tvdb: 79126,
    });
  });

  it('should coerce string numeric ids to numbers', () => {
    expect(toImportIds({ trakt: '1', tmdb: '67324', tvdb: '79126' })).toEqual({
      trakt: 1,
      imdb: undefined,
      tmdb: 67324,
      tvdb: 79126,
    });
  });

  it('should trim whitespace around string numeric ids', () => {
    expect(toImportIds({ tmdb: ' 1438 ' }).tmdb).toBe(1438);
  });

  it('should keep imdb ids as strings', () => {
    expect(toImportIds({ imdb: 'tt0306414' }).imdb).toBe('tt0306414');
  });

  it('should trim whitespace around imdb ids', () => {
    expect(toImportIds({ imdb: ' tt0306414 ' }).imdb).toBe('tt0306414');
  });

  it('should drop empty and whitespace-only imdb ids', () => {
    expect(toImportIds({ imdb: '' }).imdb).toBeUndefined();
    expect(toImportIds({ imdb: '   ' }).imdb).toBeUndefined();
  });

  it('should drop non-numeric values for numeric ids', () => {
    expect(toImportIds({ tmdb: 'tt0306414' }).tmdb).toBeUndefined();
    expect(toImportIds({ tmdb: '' }).tmdb).toBeUndefined();
  });

  it('should drop zero and negative ids', () => {
    expect(toImportIds({ tmdb: 0, tvdb: '0', trakt: -1 })).toEqual({
      trakt: undefined,
      imdb: undefined,
      tmdb: undefined,
      tvdb: undefined,
    });
  });

  it('should drop non-integer numeric ids', () => {
    expect(toImportIds({ tmdb: 14.38 }).tmdb).toBeUndefined();
  });

  it('should drop nullish ids', () => {
    expect(toImportIds({ trakt: null, imdb: undefined, tmdb: null })).toEqual({
      trakt: undefined,
      imdb: undefined,
      tmdb: undefined,
      tvdb: undefined,
    });
  });
});
