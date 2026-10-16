import { describe, expect, it } from 'vitest';
import { matchesDiscoverMode } from './matchesDiscoverMode.ts';

describe('util: matchesDiscoverMode', () => {
  it('should match every media type in media mode', () => {
    expect(matchesDiscoverMode({ mediaType: 'movies', mode: 'media' }))
      .toBe(true);
    expect(matchesDiscoverMode({ mediaType: 'shows', mode: 'media' }))
      .toBe(true);
  });

  it('should match the media type of the mode', () => {
    expect(matchesDiscoverMode({ mediaType: 'movies', mode: 'movie' }))
      .toBe(true);
    expect(matchesDiscoverMode({ mediaType: 'shows', mode: 'show' }))
      .toBe(true);
  });

  it('should not match another media type', () => {
    expect(matchesDiscoverMode({ mediaType: 'shows', mode: 'movie' }))
      .toBe(false);
    expect(matchesDiscoverMode({ mediaType: 'media', mode: 'show' }))
      .toBe(false);
  });
});
