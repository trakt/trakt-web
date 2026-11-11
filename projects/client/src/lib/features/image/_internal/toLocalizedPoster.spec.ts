import { describe, expect, it } from 'vitest';
import { toLocalizedPoster } from './toLocalizedPoster.ts';

describe('util: toLocalizedPoster', () => {
  it('should point a movie poster at its language file', () => {
    expect(
      toLocalizedPoster({
        url: 'https://media.trakt.tv/movies/102156/medium/poster.webp',
        language: 'fr',
      }),
    ).toEqual({
      src: 'https://media.trakt.tv/movies/102156/medium/poster-fr.webp',
      type: 'movies',
      id: '102156',
      language: 'fr',
    });
  });

  it('should keep the requested size for shows', () => {
    expect(
      toLocalizedPoster({
        url: 'https://media.trakt.tv/shows/1388/thumb/poster.webp',
        language: 'pt',
      })?.src,
    ).toBe('https://media.trakt.tv/shows/1388/thumb/poster-pt.webp');
  });

  it('should skip english', () => {
    expect(
      toLocalizedPoster({
        url: 'https://media.trakt.tv/movies/1/medium/poster.webp',
        language: null,
      }),
    ).toBeNull();
  });

  it('should skip other slots, types and hosts', () => {
    const urls = [
      'https://media.trakt.tv/movies/1/medium/fanart.webp',
      'https://media.trakt.tv/seasons/1/medium/poster.webp',
      'https://media.trakt.tv/movies/1/medium/poster-fr.webp',
      'https://example.com/movies/1/medium/poster.webp',
    ];

    expect(
      urls.map((url) => toLocalizedPoster({ url, language: 'fr' })),
    ).toEqual([null, null, null, null]);
  });
});
