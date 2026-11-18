import { describe, expect, it } from 'vitest';
import { toMediaImageUrl } from './toMediaImageUrl.ts';

describe('util: toMediaImageUrl', () => {
  it('should build a movie poster url', () => {
    expect(
      toMediaImageUrl({
        type: 'movies',
        id: 1390,
        slot: 'poster',
        size: 'medium',
      }),
    ).toBe('https://media.trakt.tv/movies/1390/medium/poster.webp');
  });

  it('should build an episode screenshot url', () => {
    expect(
      toMediaImageUrl({
        type: 'episodes',
        id: 14554539,
        slot: 'screenshot',
        size: 'thumb',
      }),
    ).toBe('https://media.trakt.tv/episodes/14554539/thumb/screenshot.webp');
  });

  it('should build a person headshot url', () => {
    expect(
      toMediaImageUrl({
        type: 'people',
        id: 1,
        slot: 'headshot',
        size: 'full',
      }),
    ).toBe('https://media.trakt.tv/people/1/full/headshot.webp');
  });

  it.each(['logo', 'clearart', 'banner'] as const)(
    'should use the medium size for thumb %s requests',
    (slot) => {
      expect(
        toMediaImageUrl({ type: 'shows', id: 1390, slot, size: 'thumb' }),
      ).toBe(`https://media.trakt.tv/shows/1390/medium/${slot}.webp`);
    },
  );

  it('should keep the thumb size for fanart', () => {
    expect(
      toMediaImageUrl({
        type: 'shows',
        id: 1390,
        slot: 'fanart',
        size: 'thumb',
      }),
    ).toBe('https://media.trakt.tv/shows/1390/thumb/fanart.webp');
  });

  it('should build a show character portrait url', () => {
    expect(
      toMediaImageUrl({
        type: 'portraits',
        id: 'show-1390-447271',
        slot: 'portrait',
        size: 'thumb',
      }),
    ).toBe(
      'https://media.trakt.tv/portraits/show-1390-447271/thumb/portrait.webp',
    );
  });

  it('should build a movie character portrait url', () => {
    expect(
      toMediaImageUrl({
        type: 'portraits',
        id: 'movie-120-6384',
        slot: 'portrait',
        size: 'medium',
      }),
    ).toBe(
      'https://media.trakt.tv/portraits/movie-120-6384/medium/portrait.webp',
    );
  });

  it('should build a season character portrait url', () => {
    expect(
      toMediaImageUrl({
        type: 'portraits',
        id: 'show-1390-s2-447271',
        slot: 'portrait',
        size: 'medium',
      }),
    ).toBe(
      'https://media.trakt.tv/portraits/show-1390-s2-447271/medium/portrait.webp',
    );
  });
});
