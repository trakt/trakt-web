import type { LoreMovie } from '$lib/requests/models/LoreMovie.ts';
import { describe, expect, it } from 'vitest';
import { toLoreProgress } from './toLoreProgress.ts';

function movie(id: number): LoreMovie {
  return {
    id,
    slug: `movie-${id}`,
    title: `Movie ${id}`,
    year: 2000 + id,
    poster: null,
  };
}

const EARLIER = [movie(1), movie(2), movie(3)];

describe('util: toLoreProgress', () => {
  it('should count the watched earlier films and point at the first unwatched one', () => {
    const progress = toLoreProgress({
      earlier: EARLIER,
      watchedIds: new Set([1, 3]),
    });

    expect(progress.watchedCount).toBe(2);
    expect(progress.totalCount).toBe(3);
    expect(progress.next).toBe(EARLIER[1]);
    expect(progress.steps).to.deep.equal([
      { id: 1, state: 'covered' },
      { id: 2, state: 'next' },
      { id: 3, state: 'covered' },
    ]);
  });

  it('should have no next film once every earlier film is watched', () => {
    const progress = toLoreProgress({
      earlier: EARLIER,
      watchedIds: new Set([1, 2, 3, 99]),
    });

    expect(progress.watchedCount).toBe(3);
    expect(progress.next).toBeNull();
  });

  it('should start at the first film when nothing is watched', () => {
    const progress = toLoreProgress({
      earlier: EARLIER,
      watchedIds: new Set(),
    });

    expect(progress.watchedCount).toBe(0);
    expect(progress.next).toBe(EARLIER[0]);
    expect(progress.steps.map(({ state }) => state)).to.deep.equal([
      'next',
      'pending',
      'pending',
    ]);
  });

  it('should handle a movie without earlier films', () => {
    expect(
      toLoreProgress({ earlier: [], watchedIds: new Set([1]) }),
    ).to.deep.equal({
      steps: [],
      watchedCount: 0,
      totalCount: 0,
      next: null,
    });
  });
});
