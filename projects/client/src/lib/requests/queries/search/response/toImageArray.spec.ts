import { describe, expect, it } from 'vitest';
import { toImageArray } from './toImageArray.ts';

describe('toImageArray', () => {
  it('should build a movie poster url from the trakt id', () => {
    expect(
      toImageArray({ type: 'movies', id: '603', slot: 'poster' }),
    ).to.deep.equal(['https://media.trakt.tv/movies/603/medium/poster.webp']);
  });

  it('should build a show poster url from the trakt id', () => {
    expect(
      toImageArray({ type: 'shows', id: '1390', slot: 'poster' }),
    ).to.deep.equal(['https://media.trakt.tv/shows/1390/medium/poster.webp']);
  });

  it('should build a person headshot url from the trakt id', () => {
    expect(
      toImageArray({ type: 'people', id: '1', slot: 'headshot' }),
    ).to.deep.equal(['https://media.trakt.tv/people/1/medium/headshot.webp']);
  });
});
