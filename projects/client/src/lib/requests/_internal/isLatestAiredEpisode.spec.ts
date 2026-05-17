import { describe, expect, it } from 'vitest';
import { isLatestAiredEpisode } from './isLatestAiredEpisode.ts';

describe('isLatestAiredEpisode', () => {
  it('returns false when episode is missing', () => {
    expect(isLatestAiredEpisode(null, { season: 1, number: 1 })).toBe(false);
  });

  it('returns true when latest is missing', () => {
    expect(isLatestAiredEpisode({ season: 1, number: 1 }, null)).toBe(true);
  });

  it('returns true when episode matches latest', () => {
    expect(
      isLatestAiredEpisode(
        { season: 3, number: 10 },
        { season: 3, number: 10 },
      ),
    ).toBe(true);
  });

  it('returns false when a later episode in same season has aired', () => {
    expect(
      isLatestAiredEpisode(
        { season: 3, number: 10 },
        { season: 3, number: 11 },
      ),
    ).toBe(false);
  });

  it('returns false when a later season has aired', () => {
    expect(
      isLatestAiredEpisode(
        { season: 3, number: 10 },
        { season: 4, number: 1 },
      ),
    ).toBe(false);
  });

  it('returns true when episode is in a future season', () => {
    expect(
      isLatestAiredEpisode(
        { season: 4, number: 1 },
        { season: 3, number: 10 },
      ),
    ).toBe(true);
  });

  it('returns true when episode is later in the same season', () => {
    expect(
      isLatestAiredEpisode(
        { season: 3, number: 11 },
        { season: 3, number: 10 },
      ),
    ).toBe(true);
  });
});
