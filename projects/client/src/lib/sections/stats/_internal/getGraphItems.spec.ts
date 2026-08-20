import { WAKING_HOURS_PER_DAY } from '$lib/sections/stats/_internal/constants/index.ts';
import type { WeekData } from '$lib/sections/stats/_internal/models/WeekData.ts';
import { buildWeekData } from '$test/beds/stats/buildWeekData.ts';
import { describe, expect, it } from 'vitest';
import { getGraphItems } from './getGraphItems.ts';

const now = new Date(2026, 0, 7, 12);

function getGraphs(thisWeek: WeekData) {
  return getGraphItems({
    thisWeek,
    now,
    wakingHoursPerDay: WAKING_HOURS_PER_DAY,
  });
}

function getKey(items: ReturnType<typeof getGraphItems>, key: string) {
  return items.find((item) => item.key === key);
}

describe('getGraphItems', () => {
  describe('isEmpty', () => {
    it('should flag both graphs as empty when nothing was watched', () => {
      const items = getGraphs(buildWeekData());

      expect(getKey(items, 'screenTimeDaily')?.isEmpty).toBe(true);
      expect(getKey(items, 'peakHours')?.isEmpty).toBe(true);
    });

    it('should flag the daily graph as empty when minutes are missing', () => {
      const items = getGraphs(buildWeekData({ dailyMinutes: [] }));

      expect(getKey(items, 'screenTimeDaily')?.isEmpty).toBe(true);
    });

    it('should pair every day label with its own minutes', () => {
      const items = getGraphs(
        buildWeekData({ dailyMinutes: [0, 0, 0, 0, 0, 0, 120] }),
      );
      const entry = getKey(items, 'screenTimeDaily');

      expect(entry?.kind).toBe('screenTimeDaily');
      if (entry?.kind !== 'screenTimeDaily') return;

      expect(entry.data.days).toHaveLength(7);
      expect(entry.data.days.at(-1)?.minutes).toBe(120);
      expect(entry.data.days.at(-1)?.label).toBeTruthy();
    });

    it('should not flag the daily graph as empty when a day has watch time', () => {
      const items = getGraphs(
        buildWeekData({ dailyMinutes: [0, 0, 0, 0, 0, 0, 120] }),
      );

      expect(getKey(items, 'screenTimeDaily')?.isEmpty).toBe(false);
    });

    it('should not flag peak hours as empty when a title was watched', () => {
      const items = getGraphs(
        buildWeekData({ movieDates: [new Date(2026, 0, 7, 20)] }),
      );

      expect(getKey(items, 'peakHours')?.isEmpty).toBe(false);
    });
  });
});
