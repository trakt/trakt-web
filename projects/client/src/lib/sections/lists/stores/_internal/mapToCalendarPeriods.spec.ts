import type { ActivityEntry } from '$lib/sections/lists/stores/models/ActivityEntry.ts';
import { describe, expect, it } from 'vitest';
import { mapToCalendarPeriods } from './mapToCalendarPeriods.ts';

type TestEntry = ActivityEntry<{ id: number }>;

function createEntry(id: number, watchedAt: Date): TestEntry {
  return { id, watchedAt };
}

// With 'en' locale, weeks start on Sunday.
// Week A: 2024-03-03 (Sun) – 2024-03-09 (Sat)
// Week B: 2024-03-10 (Sun) – 2024-03-16 (Sat)
const WEEK_A_MON = new Date('2024-03-04T12:00:00');
const WEEK_A_WED = new Date('2024-03-06T12:00:00');
const WEEK_B_MON = new Date('2024-03-11T12:00:00');

describe('mapToCalendarPeriods', () => {
  it('returns an empty array for empty input', () => {
    expect(mapToCalendarPeriods([])).toEqual([]);
  });

  it('returns a single period for a single item', () => {
    const result = mapToCalendarPeriods([createEntry(1, WEEK_A_MON)]);

    expect(result).toHaveLength(1);
  });

  it('groups items from the same week into one period', () => {
    const items = [createEntry(1, WEEK_A_MON), createEntry(2, WEEK_A_WED)];

    const result = mapToCalendarPeriods(items);

    expect(result).toHaveLength(1);
  });

  it('groups items from different weeks into separate periods', () => {
    const items = [createEntry(1, WEEK_A_MON), createEntry(2, WEEK_B_MON)];

    const result = mapToCalendarPeriods(items);

    expect(result).toHaveLength(2);
  });

  it('sorts periods with the most recent week first', () => {
    const items = [createEntry(1, WEEK_A_MON), createEntry(2, WEEK_B_MON)];

    const result = mapToCalendarPeriods(items);

    const firstPeriodDate = result.at(0)?.calendar.at(0)?.date.getTime() ?? 0;
    const secondPeriodDate = result.at(1)?.calendar.at(0)?.date.getTime() ?? 0;
    expect(firstPeriodDate).toBeGreaterThan(secondPeriodDate);
  });

  it('generates a period key prefixed with "period-"', () => {
    const result = mapToCalendarPeriods([createEntry(1, WEEK_A_MON)]);

    expect(result.at(0)?.key).toMatch(/^period-\d+$/);
  });

  it('each period calendar has 7 days', () => {
    const items = [createEntry(1, WEEK_A_MON), createEntry(2, WEEK_B_MON)];

    const result = mapToCalendarPeriods(items);

    for (const period of result) {
      expect(period.calendar).toHaveLength(7);
    }
  });

  it('places items on the correct day within the calendar', () => {
    const result = mapToCalendarPeriods([createEntry(1, WEEK_A_MON)]);

    const calendar = result.at(0)?.calendar;
    const monday = calendar?.find(
      (day) => day.date.getDate() === WEEK_A_MON.getDate(),
    );
    expect(monday?.items).toHaveLength(1);
    expect(monday?.items.at(0)).toMatchObject({ id: 1 });
  });

  it('groups multiple items on the same day', () => {
    const entry1 = createEntry(1, new Date('2024-03-04T10:00:00'));
    const entry2 = createEntry(2, new Date('2024-03-04T20:00:00'));

    const result = mapToCalendarPeriods([entry1, entry2]);
    const calendar = result.at(0)?.calendar;
    const monday = calendar?.find((day) => day.date.getDate() === 4);

    expect(monday?.items).toHaveLength(2);
  });

  it('assigns unique keys to separate periods', () => {
    const items = [createEntry(1, WEEK_A_MON), createEntry(2, WEEK_B_MON)];

    const result = mapToCalendarPeriods(items);

    const keys = result.map((p) => p.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
