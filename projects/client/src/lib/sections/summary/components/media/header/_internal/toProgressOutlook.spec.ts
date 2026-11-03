import type { EpisodeProgressEntry } from '$lib/requests/models/EpisodeProgressEntry.ts';
import { describe, expect, it } from 'vitest';
import { toProgressOutlook } from './toProgressOutlook.ts';

function progressWith(
  overrides: Partial<EpisodeProgressEntry>,
): EpisodeProgressEntry {
  return {
    id: 101,
    season: 2,
    number: 4,
    total: 16,
    completed: 11,
    remaining: 5,
    minutesLeft: 276,
    isLatestAired: false,
    lastEpisode: { season: 2, number: 3, title: '', overview: '' },
    ...overrides,
  } as EpisodeProgressEntry;
}

describe('util: toProgressOutlook', () => {
  describe('when started', () => {
    it('should name the next episode as up next', () => {
      const { next } = toProgressOutlook(progressWith({}));

      expect(next?.kicker).toBe('Up next');
      expect(next?.label).toMatchInlineSnapshot(`"S2 • E4"`);
    });

    it('should count the watched episodes and the last one seen', () => {
      const { foot, fraction } = toProgressOutlook(progressWith({}));

      expect(foot).toMatchInlineSnapshot(`"11 of 16 · last seen S2 • E3"`);
      expect(fraction).toBeCloseTo(11 / 16);
    });
  });

  describe('before the first episode', () => {
    it('should start with the first episode', () => {
      const { next, foot, fraction } = toProgressOutlook(
        progressWith({
          season: 1,
          number: 1,
          completed: 0,
          remaining: 16,
          lastEpisode: null,
        }),
      );

      expect(next?.kicker).toBe('Start with');
      expect(next?.label).toMatchInlineSnapshot(`"S1 • E1"`);
      expect(foot).toMatchInlineSnapshot(`"0 of 16 · not started"`);
      expect(fraction).toBe(0);
    });
  });

  describe('when caught up', () => {
    it('should offer no next episode and a full bar', () => {
      const { next, fraction } = toProgressOutlook(
        progressWith({ id: -1, season: -1, number: -1, completed: 16, remaining: 0 }),
      );

      expect(next).toBeNull();
      expect(fraction).toBe(1);
    });
  });
});
