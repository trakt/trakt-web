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
  movieMinutes: 0,
  showMinutes: 0,
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
      expect(keys).toContain('movieTime');
      expect(keys).toContain('showTime');
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
      expect(keys).toContain('movieTime');
      expect(keys).not.toContain('showTime');
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
      expect(keys).not.toContain('movieTime');
      expect(keys).toContain('showTime');
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
      expect(getKey(items, 'movieTime')?.deltaKind).toBe('time');
      expect(getKey(items, 'showTime')?.deltaKind).toBe('time');
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

    it('movieTime rawValue equals movieMinutes', () => {
      const items = getStatItems({
        thisWeek: makeWeek({ movieMinutes: 120 }),
        lastWeek: emptyWeek,
        mode: 'movie',
      });
      expect(getKey(items, 'movieTime')?.rawValue).toBe(120);
    });

    it('showTime rawValue equals showMinutes', () => {
      const items = getStatItems({
        thisWeek: makeWeek({ showMinutes: 90 }),
        lastWeek: emptyWeek,
        mode: 'show',
      });
      expect(getKey(items, 'showTime')?.rawValue).toBe(90);
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

    it('movieTime delta is difference in movie minutes', () => {
      const items = getStatItems({
        thisWeek: makeWeek({ movieMinutes: 120 }),
        lastWeek: makeWeek({ movieMinutes: 60 }),
        mode: 'movie',
      });
      expect(getKey(items, 'movieTime')?.delta).toBe(60);
    });

    it('showTime delta is difference in show minutes', () => {
      const items = getStatItems({
        thisWeek: makeWeek({ showMinutes: 30 }),
        lastWeek: makeWeek({ showMinutes: 90 }),
        mode: 'show',
      });
      expect(getKey(items, 'showTime')?.delta).toBe(-60);
    });
  });
});
