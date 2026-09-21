import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { isMediaDropped } from './isMediaDropped.ts';

describe('util: isMediaDropped', () => {
  it('should be true for a dropped show', () => {
    const dropped = { shows: new Set([ShowSiloMappedMock.id]) };

    expect(isMediaDropped(ShowSiloMappedMock, dropped)).to.equal(true);
  });

  it('should be false for a show that is not dropped', () => {
    const dropped = { shows: new Set([ShowSiloMappedMock.id + 1]) };

    expect(isMediaDropped(ShowSiloMappedMock, dropped)).to.equal(false);
  });

  it('should be false for a movie whose trakt id matches a dropped show', () => {
    const dropped = { shows: new Set([MovieHereticMappedMock.id]) };

    expect(isMediaDropped(MovieHereticMappedMock, dropped)).to.equal(false);
  });

  it('should be false when the dropped history has not loaded', () => {
    expect(isMediaDropped(ShowSiloMappedMock, undefined)).to.equal(false);
  });
});
