import {
  EPISODE_COVER_PLACEHOLDER,
  MEDIA_COVER_LARGE_PLACEHOLDER,
  MEDIA_COVER_THUMB_PLACEHOLDER,
  MEDIA_POSTER_PLACEHOLDER,
} from '$lib/utils/assets.ts';
import { describe, expect, it } from 'vitest';
import { toImageFallbacks } from './toImageFallbacks.ts';

describe('toImageFallbacks', () => {
  it.each([
    ['movies/1/thumb/poster.webp', [MEDIA_POSTER_PLACEHOLDER]],
    ['people/1/medium/headshot.webp', [MEDIA_POSTER_PLACEHOLDER]],
    ['episodes/1/thumb/screenshot.webp', [EPISODE_COVER_PLACEHOLDER]],
    ['shows/1/thumb/fanart.webp', [MEDIA_COVER_THUMB_PLACEHOLDER]],
    ['shows/1/medium/fanart.webp', [MEDIA_COVER_LARGE_PLACEHOLDER]],
    ['shows/1/medium/logo.webp', []],
  ])('should resolve the fallbacks for %s', (path, expected) => {
    expect(toImageFallbacks(`https://media.trakt.tv/${path}`)).toEqual(
      expected,
    );
  });

  it('should fall back from a thumb to the fanart of the same item', () => {
    expect(
      toImageFallbacks('https://media.trakt.tv/shows/1390/medium/thumb.webp'),
    ).toEqual([
      'https://media.trakt.tv/shows/1390/thumb/fanart.webp',
      MEDIA_COVER_THUMB_PLACEHOLDER,
    ]);
  });

  it('should fall back from a character to the person headshot', () => {
    expect(
      toImageFallbacks(
        'https://media.trakt.tv/characters/1390-447271/thumb/headshot.webp',
      ),
    ).toEqual([
      'https://media.trakt.tv/people/447271/thumb/headshot.webp',
      MEDIA_POSTER_PLACEHOLDER,
    ]);
  });

  it('should ignore a version query', () => {
    expect(
      toImageFallbacks('https://media.trakt.tv/movies/1/thumb/poster.webp?v=1'),
    ).toEqual([MEDIA_POSTER_PLACEHOLDER]);
  });

  it('should not resolve fallbacks for other urls', () => {
    expect(toImageFallbacks('https://image.tmdb.org/t/p/w300/a.jpg')).toEqual(
      [],
    );
  });
});
