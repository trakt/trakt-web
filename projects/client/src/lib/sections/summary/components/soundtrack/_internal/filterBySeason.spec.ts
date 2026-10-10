import type { SoundtrackTrack } from '$lib/requests/models/SoundtrackTrack.ts';
import { describe, expect, it } from 'vitest';
import { filterBySeason } from './filterBySeason.ts';

function track(
  overrides: Partial<SoundtrackTrack> & { position: number },
): SoundtrackTrack {
  return {
    key: `track_${overrides.position}`,
    title: `Track ${overrides.position}`,
    performer: null,
    spotifyId: null,
    ...overrides,
  };
}

describe('util: filterBySeason', () => {
  const tracks = [
    track({ position: 0, season: null }),
    track({ position: 1, season: 1 }),
    track({ position: 2, season: 2 }),
  ];

  it('should keep every track without a season', () => {
    expect(filterBySeason(tracks, null)).to.equal(tracks);
  });

  it('should keep the season and the series-wide tracks', () => {
    expect(filterBySeason(tracks, 2).map(({ position }) => position))
      .to.deep.equal([0, 2]);
  });

  it('should treat a missing season as series-wide', () => {
    expect(filterBySeason([track({ position: 0 })], 3)).to.have.length(1);
  });
});
