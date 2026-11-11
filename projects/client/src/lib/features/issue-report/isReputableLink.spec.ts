import { describe, expect, it } from 'vitest';
import { isReputableLink } from './isReputableLink.ts';

describe('util: isReputableLink', () => {
  it.each([
    'https://www.imdb.com/title/tt0087182/',
    'https://m.imdb.com/title/tt0087182/',
    'https://www.themoviedb.org/movie/841-dune',
    'https://www.rottentomatoes.com/m/dune',
    'https://letterboxd.com/film/dune/',
    'https://thetvdb.com/series/dune',
    'https://www.metacritic.com/movie/dune/',
    'https://en.wikipedia.org/wiki/Dune_(1984_film)',
    'http://imdb.com/title/tt0087182/',
  ])('should accept %s', (link) => {
    expect(isReputableLink(link)).toBe(true);
  });

  it.each([
    '',
    'imdb.com/title/tt0087182',
    'https://example.com/dune',
    'https://notimdb.com/title/tt0087182',
    'https://imdb.com.evil.example/title',
    'javascript:alert(1)', // skipcq: JS-0087
    'ftp://imdb.com/title',
  ])('should reject %s', (link) => {
    expect(isReputableLink(link)).toBe(false);
  });
});
