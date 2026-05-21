import { WAKING_HOURS_PER_DAY } from '$lib/sections/stats/_internal/constants/index.ts';
import { describe, expect, it } from 'vitest';
import { getStatItems } from './getStatItems.ts';
import type { WeekData } from './models/WeekData.ts';

const wakingMinutesPerWeek = WAKING_HOURS_PER_DAY * 7 * 60;

const emptyWeek: WeekData = {
  movieDates: [],
  showDates: [],
  uniqueShows: 0,
  ratings: [],
  totalMinutes: 0,
  dailyMinutes: [],
};

function makeWeek(overrides: Partial<WeekData> = {}): WeekData {
  return { ...emptyWeek, ...overrides };
}

function getKey(
  items: ReturnType<typeof getStatItems>,
  key: string,
) {
  return items.find((item) => item.key === key);
}

describe('getStatItems', () => {
  describe('keys returned by mode', () => {
    it('returns common + movie + show stats for media mode', () => {
      const items = getStatItems({
        thisWeek: emptyWeek,
        lastWeek: emptyWeek,
        mode: 'media',
      });
      const keys = items.map((i) => i.key);
      expect(keys).toContain('screenTimeTotal');
      expect(keys).toContain('screenTimeShare');
      expect(keys).toContain('avgPerDay');
      expect(keys).toContain('movies');
      expect(keys).toContain('episodes');
      expect(keys).toContain('shows');
    });

    it('returns common + movie stats only for movie mode', () => {
      const items = getStatItems({
        thisWeek: emptyWeek,
        lastWeek: emptyWeek,
        mode: 'movie',
      });
      const keys = items.map((i) => i.key);
      expect(keys).toContain('screenTimeTotal');
      expect(keys).toContain('screenTimeShare');
      expect(keys).toContain('avgPerDay');
      expect(keys).toContain('movies');
      expect(keys).not.toContain('episodes');
      expect(keys).not.toContain('shows');
    });

    it('returns common + show stats only for show mode', () => {
      const items = getStatItems({
        thisWeek: emptyWeek,
        lastWeek: emptyWeek,
        mode: 'show',
      });
      const keys = items.map((i) => i.key);
      expect(keys).toContain('screenTimeTotal');
      expect(keys).toContain('screenTimeShare');
      expect(keys).toContain('avgPerDay');
      expect(keys).not.toContain('movies');
      expect(keys).toContain('episodes');
      expect(keys).toContain('shows');
    });
  });

  describe('type', () => {
    it('sets type to "stat" for all items', () => {
      const items = getStatItems({
        thisWeek: emptyWeek,
        lastWeek: emptyWeek,
        mode: 'media',
      });
      expect(items.every((i) => i.type === 'stat')).toBe(true);
    });
  });

  describe('deltaKind', () => {
    it('assigns correct deltaKind for each stat', () => {
      const items = getStatItems({
        thisWeek: emptyWeek,
        lastWeek: emptyWeek,
        mode: 'media',
      });
      expect(getKey(items, 'screenTimeTotal')?.deltaKind).toBe('time');
      expect(getKey(items, 'screenTimeShare')?.deltaKind).toBe('percentage');
      expect(getKey(items, 'avgPerDay')?.deltaKind).toBe('time');
      expect(getKey(items, 'movies')?.deltaKind).toBe('count');
      expect(getKey(items, 'episodes')?.deltaKind).toBe('count');
      expect(getKey(items, 'shows')?.deltaKind).toBe('count');
    });
  });

  describe('rawValue', () => {
    it('screenTimeTotal rawValue equals totalMinutes', () => {
      const items = getStatItems({
        thisWeek: makeWeek({ totalMinutes: 300 }),
        lastWeek: emptyWeek,
        mode: 'movie',
      });
      expect(getKey(items, 'screenTimeTotal')?.rawValue).toBe(300);
    });

    it('screenTimeShare rawValue is percentage of waking minutes per week', () => {
      const items = getStatItems({
        thisWeek: makeWeek({ totalMinutes: wakingMinutesPerWeek / 2 }),
        lastWeek: emptyWeek,
        mode: 'movie',
      });
      expect(getKey(items, 'screenTimeShare')?.rawValue).toBe(50);
    });

    it('screenTimeShare rawValue is 0 when no watch time', () => {
      const items = getStatItems({
        thisWeek: emptyWeek,
        lastWeek: emptyWeek,
        mode: 'movie',
      });
      expect(getKey(items, 'screenTimeShare')?.rawValue).toBe(0);
    });

    it('avgPerDay rawValue is totalMinutes divided by unique active days', () => {
      const day1 = new Date(2026, 0, 1, 10);
      const day2 = new Date(2026, 0, 2, 10);
      const items = getStatItems({
        thisWeek: makeWeek({
          totalMinutes: 120,
          movieDates: [day1, day2],
        }),
        lastWeek: emptyWeek,
        mode: 'movie',
      });
      expect(getKey(items, 'avgPerDay')?.rawValue).toBe(60);
    });

    it('avgPerDay rawValue is 0 when no active days', () => {
      const items = getStatItems({
        thisWeek: emptyWeek,
        lastWeek: emptyWeek,
        mode: 'movie',
      });
      expect(getKey(items, 'avgPerDay')?.rawValue).toBe(0);
    });

    it('movies rawValue equals movieDates length', () => {
      const items = getStatItems({
        thisWeek: makeWeek({
          movieDates: [new Date(), new Date(), new Date()],
        }),
        lastWeek: emptyWeek,
        mode: 'movie',
      });
      expect(getKey(items, 'movies')?.rawValue).toBe(3);
    });

    it('episodes rawValue equals showDates length', () => {
      const items = getStatItems({
        thisWeek: makeWeek({
          showDates: [new Date(), new Date()],
        }),
        lastWeek: emptyWeek,
        mode: 'show',
      });
      expect(getKey(items, 'episodes')?.rawValue).toBe(2);
    });

    it('shows rawValue equals uniqueShows', () => {
      const items = getStatItems({
        thisWeek: makeWeek({ uniqueShows: 5 }),
        lastWeek: emptyWeek,
        mode: 'show',
      });
      expect(getKey(items, 'shows')?.rawValue).toBe(5);
    });
  });

  describe('delta', () => {
    it('screenTimeTotal delta is difference between weeks', () => {
      const items = getStatItems({
        thisWeek: makeWeek({ totalMinutes: 300 }),
        lastWeek: makeWeek({ totalMinutes: 200 }),
        mode: 'movie',
      });
      expect(getKey(items, 'screenTimeTotal')?.delta).toBe(100);
    });

    it('screenTimeShare delta is difference in percentage points', () => {
      const half = wakingMinutesPerWeek / 2;
      const quarter = wakingMinutesPerWeek / 4;
      const items = getStatItems({
        thisWeek: makeWeek({ totalMinutes: half }),
        lastWeek: makeWeek({ totalMinutes: quarter }),
        mode: 'movie',
      });
      expect(getKey(items, 'screenTimeShare')?.delta).toBe(25);
    });

    it('movies delta is difference in movie count', () => {
      const items = getStatItems({
        thisWeek: makeWeek({ movieDates: [new Date(), new Date()] }),
        lastWeek: makeWeek({ movieDates: [new Date()] }),
        mode: 'movie',
      });
      expect(getKey(items, 'movies')?.delta).toBe(1);
    });

    it('episodes delta is difference in episode count', () => {
      const items = getStatItems({
        thisWeek: makeWeek({ showDates: [new Date()] }),
        lastWeek: makeWeek({ showDates: [new Date(), new Date(), new Date()] }),
        mode: 'show',
      });
      expect(getKey(items, 'episodes')?.delta).toBe(-2);
    });

    it('shows delta is difference in unique show count', () => {
      const items = getStatItems({
        thisWeek: makeWeek({ uniqueShows: 4 }),
        lastWeek: makeWeek({ uniqueShows: 4 }),
        mode: 'show',
      });
      expect(getKey(items, 'shows')?.delta).toBe(0);
    });
  });
});
