import type { HistoryEntry } from '$lib/sections/lists/stores/models/HistoryEntry.ts';
import { describe, expect, it } from 'vitest';
import { mapToActivityCalendar } from './mapToActivityCalendar.ts';

function createHistoryEntry(watchedAt: Date): HistoryEntry {
  return { watchedAt } as unknown as HistoryEntry;
}

describe('mapToActivityCalendar', () => {
  it('should return an empty array when no startDate is provided', () => {
    const items = [createHistoryEntry(new Date('2024-03-01'))];

    expect(mapToActivityCalendar(items)).toEqual([]);
  });

  it('should return 7 days starting from startDate', () => {
    const startDate = new Date('2024-03-01');

    const result = mapToActivityCalendar([], startDate);

    expect(result).toHaveLength(7);
    expect(result.at(0)?.date.getDate()).toBe(1);
    expect(result.at(6)?.date.getDate()).toBe(7);
  });

  it('should return days sorted in ascending order', () => {
    const startDate = new Date('2024-03-01');

    const result = mapToActivityCalendar([], startDate);

    const dates = result.map((entry) => entry.date.getTime());
    expect(dates).toEqual([...dates].sort((a, b) => a - b));
  });

  it('should place items on the correct day', () => {
    const startDate = new Date('2024-03-01');
    const watchedAt = new Date('2024-03-03');
    const entry = createHistoryEntry(watchedAt);

    const result = mapToActivityCalendar([entry], startDate);

    const march3 = result.find((day) => day.date.getDate() === 3);
    expect(march3?.items).toEqual([entry]);
  });

  it('should group multiple items on the same day', () => {
    const startDate = new Date('2024-03-01');
    const entry1 = createHistoryEntry(new Date('2024-03-02T10:00:00'));
    const entry2 = createHistoryEntry(new Date('2024-03-02T20:00:00'));

    const result = mapToActivityCalendar([entry1, entry2], startDate);

    const march2 = result.find((day) => day.date.getDate() === 2);
    expect(march2?.items).toEqual([entry2, entry1]);
  });

  it('should sort items within the same day by the watched at timestamp', () => {
    const startDate = new Date('2024-03-01');
    const later = createHistoryEntry(new Date('2024-03-02T20:00:00'));
    const earlier = createHistoryEntry(new Date('2024-03-02T10:00:00'));

    const result = mapToActivityCalendar([earlier, later], startDate);

    const day = result.find((day) => day.date.getDate() === 2);
    expect(day?.items).toEqual([later, earlier]);
  });

  it('should not include items outside the 7-day range', () => {
    const startDate = new Date('2024-03-01');
    const outsideEntry = createHistoryEntry(new Date('2024-03-10'));

    const result = mapToActivityCalendar([outsideEntry], startDate);

    const totalItems = result.flatMap((day) => day.items);
    expect(totalItems).toHaveLength(0);
  });

  it('should return empty items array for days with no activity', () => {
    const startDate = new Date('2024-03-01');
    const entry = createHistoryEntry(new Date('2024-03-01'));

    const result = mapToActivityCalendar([entry], startDate);

    const emptyDays = result.filter((day) => day.items.length === 0);
    expect(emptyDays).toHaveLength(6);
  });

  it('should distribute items across multiple days correctly', () => {
    const startDate = new Date('2024-03-01');
    const entry1 = createHistoryEntry(new Date('2024-03-01'));
    const entry2 = createHistoryEntry(new Date('2024-03-03'));
    const entry3 = createHistoryEntry(new Date('2024-03-05'));

    const result = mapToActivityCalendar([entry1, entry2, entry3], startDate);

    expect(result.find((d) => d.date.getDate() === 1)?.items).toEqual([
      entry1,
    ]);
    expect(result.find((d) => d.date.getDate() === 3)?.items).toEqual([
      entry2,
    ]);
    expect(result.find((d) => d.date.getDate() === 5)?.items).toEqual([
      entry3,
    ]);
  });
});
