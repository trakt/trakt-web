import { MovieOppenheimerAwardsMappedMock } from '$mocks/data/awards/mapped/MovieOppenheimerAwardsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toAwardSeasonPhase } from './toAwardSeasonPhase.ts';

const pending = MovieOppenheimerAwardsMappedMock.map((entry) => ({
  ...entry,
  won: null,
}));

describe('util: toAwardSeasonPhase', () => {
  it('should be pre while results are pending', () => {
    expect(
      toAwardSeasonPhase({
        entries: pending,
        today: new Date('2024-03-01T00:00'),
      }),
    ).to.equal('pre');
  });

  it('should be post on the day of the ceremony', () => {
    expect(
      toAwardSeasonPhase({
        entries: MovieOppenheimerAwardsMappedMock,
        today: new Date('2024-03-10T00:00'),
      }),
    ).to.equal('post');
  });

  it('should be post up to 14 days after the ceremony', () => {
    expect(
      toAwardSeasonPhase({
        entries: MovieOppenheimerAwardsMappedMock,
        today: new Date('2024-03-24T00:00'),
      }),
    ).to.equal('post');
  });

  it('should be none after the live window', () => {
    expect(
      toAwardSeasonPhase({
        entries: MovieOppenheimerAwardsMappedMock,
        today: new Date('2024-03-25T00:00'),
      }),
    ).to.equal('none');
  });

  it('should be none when no ceremony date is known', () => {
    const undated = MovieOppenheimerAwardsMappedMock.map((entry) => ({
      ...entry,
      ceremony: { ...entry.ceremony, heldAt: null },
    }));

    expect(
      toAwardSeasonPhase({
        entries: undated,
        today: new Date('2024-03-12T00:00'),
      }),
    ).to.equal('none');
  });
});
