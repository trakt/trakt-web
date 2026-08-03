import type { SoundtrackTrack } from '$lib/requests/models/SoundtrackTrack.ts';
import { describe, expect, it } from 'vitest';
import { toSoundtrackSummary } from './toSoundtrackSummary.ts';

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

describe('util: toSoundtrackSummary', () => {
  it('should count the playable tracks', () => {
    const summary = toSoundtrackSummary([
      track({ position: 0, spotifyId: 'a' }),
      track({ position: 1 }),
      track({ position: 2, spotifyId: 'b' }),
    ]);

    expect(summary.total).to.equal(3);
    expect(summary.playable).to.equal(2);
  });

  it('should credit a composer behind most of the listing', () => {
    const summary = toSoundtrackSummary([
      track({ position: 0, performer: 'Hans Zimmer' }),
      track({ position: 1, performer: 'Hans Zimmer' }),
      track({ position: 2, performer: 'Someone Else' }),
    ]);

    expect(summary.credit).to.equal('Hans Zimmer');
  });

  it('should not credit anyone on a compilation', () => {
    const summary = toSoundtrackSummary([
      track({ position: 0, performer: 'One' }),
      track({ position: 1, performer: 'Two' }),
      track({ position: 2, performer: 'Three' }),
    ]);

    expect(summary.credit).to.equal(null);
  });

  it('should ignore blank performers', () => {
    const summary = toSoundtrackSummary([
      track({ position: 0, performer: '  ' }),
      track({ position: 1, performer: null }),
    ]);

    expect(summary.credit).to.equal(null);
  });

  it('should handle an empty soundtrack', () => {
    expect(toSoundtrackSummary([])).to.deep.equal({
      total: 0,
      playable: 0,
      credit: null,
    });
  });
});
