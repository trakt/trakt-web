import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toGifSuggestedQuery } from './toGifSuggestedQuery.ts';

describe('util: toGifSuggestedQuery', () => {
  it('should combine the title with the media type', () => {
    expect(toGifSuggestedQuery(MovieHereticMappedMock)).toBe('Heretic movie');
  });
});
