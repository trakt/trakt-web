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
    lastEpisode: {
      season: 2,
      number: 3,
      title: 'Solo',
      overview: 'Juliette reaches the silo next door.',
    },
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

    it('should name the last episode seen with its synopsis', () => {
      const { previous } = toProgressOutlook(progressWith({}));

      expect(previous).toEqual({
        kicker: 'Previously · S2 • E3',
        season: 2,
        number: 3,
        title: 'Solo',
        overview: 'Juliette reaches the silo next door.',
      });
    });

    it('should leave out a synopsis the API does not have', () => {
      const { previous } = toProgressOutlook(
        progressWith({
          lastEpisode: { season: 2, number: 3, title: 'Solo', overview: ' ' },
        }),
      );

      expect(previous?.title).toBe('Solo');
      expect(previous?.overview).toBeNull();
    });
  });

  describe('before the first episode', () => {
    it('should start with the first episode and recall nothing', () => {
      const { next, previous } = toProgressOutlook(
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
      expect(previous).toBeNull();
    });
  });

  describe('when caught up', () => {
    it('should offer no next episode but still recall the last one', () => {
      const { next, previous } = toProgressOutlook(
        progressWith({
          id: -1,
          season: -1,
          number: -1,
          completed: 16,
          remaining: 0,
        }),
      );

      expect(next).toBeNull();
      expect(previous?.kicker).toBe('Previously · S2 • E3');
    });
  });
});
