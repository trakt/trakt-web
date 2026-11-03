import { describe, expect, it } from 'vitest';
import type { EpisodeProgressEntry } from '$lib/requests/models/EpisodeProgressEntry.ts';
import { toRecapStanding } from './toRecapStanding.ts';

function progressWith(
  overrides: Partial<EpisodeProgressEntry>,
): EpisodeProgressEntry {
  return {
    total: 24,
    completed: 22,
    remaining: 2,
    minutesLeft: 107,
    isLatestAired: true,
    ...overrides,
  } as EpisodeProgressEntry;
}

describe('util: toRecapStanding', () => {
  describe('when episodes are left', () => {
    it('should report how far behind the viewer is', () => {
      const standing = toRecapStanding(progressWith({ remaining: 2 }));

      expect(standing.tone).toBe('behind');
      expect(standing.label).toMatchInlineSnapshot(`"2 behind"`);
    });

    it('should report the time left to catch up', () => {
      const standing = toRecapStanding(progressWith({ minutesLeft: 107 }));

      expect(standing.timeLeft).toMatchInlineSnapshot(`"1h 47m left"`);
    });

    it('should drop a runtime that rounds to nothing', () => {
      const standing = toRecapStanding(progressWith({ minutesLeft: 0 }));

      expect(standing.timeLeft).toBeNull();
    });
  });

  describe('when nothing is left', () => {
    it('should report the viewer as up to date', () => {
      const standing = toRecapStanding(
        progressWith({ remaining: 0, completed: 24 }),
      );

      expect(standing.tone).toBe('caught-up');
      expect(standing.label).toMatchInlineSnapshot(`"Up to date"`);
    });

    it('should not offer a time left', () => {
      const standing = toRecapStanding(
        progressWith({ remaining: 0, minutesLeft: 107 }),
      );

      expect(standing.timeLeft).toBeNull();
    });
  });

  describe('before the first episode', () => {
    it('should report the episode count in a neutral pill', () => {
      const standing = toRecapStanding(
        progressWith({ completed: 0, remaining: 16, total: 16 }),
      );

      expect(standing.tone).toBe('neutral');
      expect(standing.label).toMatchInlineSnapshot(`"16 episodes"`);
    });

    it('should report the whole runtime as the total', () => {
      const standing = toRecapStanding(
        progressWith({ completed: 0, remaining: 16, total: 16, minutesLeft: 432 }),
      );

      expect(standing.timeLeft).toMatchInlineSnapshot(`"7h 12m total"`);
    });
  });
});
