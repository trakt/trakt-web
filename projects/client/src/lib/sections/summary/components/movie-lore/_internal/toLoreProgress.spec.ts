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

const EARLIER = [movie(1), movie(2), movie(3), movie(4)];

describe('util: toLoreProgress', () => {
  it('should split the earlier films into must-watch and optional', () => {
    const progress = toLoreProgress({
      earlier: EARLIER,
      mustWatchIds: new Set([2, 4]),
      watchedIds: new Set(),
    });

    expect(progress.mustWatch.steps.map(({ id }) => id)).to.deep.equal([2, 4]);
    expect(progress.optional.steps.map(({ id }) => id)).to.deep.equal([1, 3]);
  });

  it('should count what the viewer has seen in each group', () => {
    const progress = toLoreProgress({
      earlier: EARLIER,
      mustWatchIds: new Set([2, 4]),
      watchedIds: new Set([1, 2, 99]),
    });

    expect(progress.mustWatch).to.deep.equal({
      steps: [
        { id: 2, isSeen: true },
        { id: 4, isSeen: false },
      ],
      seenCount: 1,
      totalCount: 2,
    });
    expect(progress.optional.seenCount).toBe(1);
    expect(progress.optional.totalCount).toBe(2);
  });

  it('should list the must-watch films that are not seen yet in release order', () => {
    const progress = toLoreProgress({
      earlier: EARLIER,
      mustWatchIds: new Set([1, 3, 4]),
      watchedIds: new Set([3]),
    });

    expect(progress.unseenMustWatch).to.deep.equal([EARLIER[0], EARLIER[3]]);
  });

  it('should have nothing left once every must-watch film is seen', () => {
    const progress = toLoreProgress({
      earlier: EARLIER,
      mustWatchIds: new Set([1]),
      watchedIds: new Set([1]),
    });

    expect(progress.unseenMustWatch).to.deep.equal([]);
  });

  it('should treat every film as optional without must-watch films', () => {
    const progress = toLoreProgress({
      earlier: EARLIER,
      mustWatchIds: new Set(),
      watchedIds: new Set([1]),
    });

    expect(progress.mustWatch.totalCount).toBe(0);
    expect(progress.optional.totalCount).toBe(4);
  });

  it('should ignore must-watch ids that are not earlier films', () => {
    const progress = toLoreProgress({
      earlier: EARLIER,
      mustWatchIds: new Set([99]),
      watchedIds: new Set(),
    });

    expect(progress.mustWatch.totalCount).toBe(0);
  });

  it('should handle a movie without earlier films', () => {
    expect(
      toLoreProgress({
        earlier: [],
        mustWatchIds: new Set(),
        watchedIds: new Set([1]),
      }),
    ).to.deep.equal({
      mustWatch: { steps: [], seenCount: 0, totalCount: 0 },
      optional: { steps: [], seenCount: 0, totalCount: 0 },
      unseenMustWatch: [],
    });
  });
});
