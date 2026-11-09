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
});
