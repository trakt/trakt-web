import { addDays } from 'date-fns/addDays';
import { describe, expect, it } from 'vitest';
import type { CalendarChunk } from '../models/CalendarChunk.ts';
import type { CalendarChunkState } from '../models/CalendarChunkState.ts';
import { toCalendarPeriods } from './toCalendarPeriods.ts';

const chunk = (start: Date, days: number, isAnchor = false): CalendarChunk => ({
  key: start.toDateString(),
  start,
  days,
  isAnchor,
});

const loaded = (start: Date, days: number): CalendarChunkState<string> => ({
  isLoading: false,
  hasUpstreamItems: true,
  calendar: Array.from({ length: days }, (_, index) => ({
    date: addDays(start, index),
    items: index === 0 ? ['item'] : [],
  })),
});

const pending: CalendarChunkState<string> = {
  isLoading: true,
  hasUpstreamItems: false,
  calendar: null,
};

const week1 = new Date(2026, 9, 4);
const week2 = new Date(2026, 9, 11);
const week3 = new Date(2026, 9, 18);
const chunks = [chunk(week1, 7), chunk(week2, 7, true), chunk(week3, 7)];

const toStates = (entries: [Date, CalendarChunkState<string>][]) =>
  new Map(
    entries.map(([start, state]) => [`f:${start.toDateString()}`, state]),
  );

describe('util: toCalendarPeriods', () => {
  it('should wait for the anchor chunk', () => {
    const result = toCalendarPeriods({
      chunks,
      states: toStates([[week2, pending]]),
      keyPrefix: 'f',
      order: 'chronological',
    });

    expect(result.isInitialLoad).toBe(true);
    expect(result.periods).toEqual([]);
  });

  it('should only show loaded chunks next to the anchor', () => {
    const result = toCalendarPeriods({
      chunks,
      states: toStates([
        [week1, pending],
        [week2, loaded(week2, 7)],
        [week3, loaded(week3, 7)],
      ]),
      keyPrefix: 'f',
      order: 'chronological',
    });

    expect(result.periods.map((period) => period.calendar.at(0)?.date)).toEqual(
      [week2, week3],
    );
    expect(result.isLoadingAbove).toBe(true);
    expect(result.isLoadingBelow).toBe(false);
  });

  it('should split multi week chunks and reverse them for reverse lists', () => {
    const result = toCalendarPeriods({
      chunks: [chunk(week1, 14, true)],
      states: toStates([[week1, loaded(week1, 14)]]),
      keyPrefix: 'f',
      order: 'reverse-chronological',
    });

    expect(result.periods.map((period) => period.calendar.at(0)?.date)).toEqual(
      [week2, week1],
    );
    expect(result.periods.map((period) => period.isEmpty)).toEqual([
      true,
      false,
    ]);
  });

  it('should map pending later chunks above a reverse list', () => {
    const result = toCalendarPeriods({
      chunks,
      states: toStates([
        [week1, loaded(week1, 7)],
        [week2, loaded(week2, 7)],
        [week3, pending],
      ]),
      keyPrefix: 'f',
      order: 'reverse-chronological',
    });

    expect(result.isLoadingAbove).toBe(true);
    expect(result.isLoadingBelow).toBe(false);
  });

  it('should count the empty weeks at both edges', () => {
    const empty = (start: Date): CalendarChunkState<string> => ({
      ...loaded(start, 7),
      hasUpstreamItems: false,
    });

    const result = toCalendarPeriods({
      chunks,
      states: toStates([
        [week1, empty(week1)],
        [week2, loaded(week2, 7)],
        [week3, empty(week3)],
      ]),
      keyPrefix: 'f',
      order: 'chronological',
    });

    expect(result.emptyAbove).toBe(1);
    expect(result.emptyBelow).toBe(1);
  });

  it('should count every week at both edges when nothing has items', () => {
    const calendar = Array.from({ length: 14 }, (_, index) => ({
      date: addDays(week1, index),
      items: [],
    }));

    const result = toCalendarPeriods({
      chunks: [chunk(week1, 14, true)],
      states: toStates([[week1, { ...loaded(week1, 14), calendar }]]),
      keyPrefix: 'f',
      order: 'chronological',
    });

    expect(result.emptyAbove).toBe(2);
    expect(result.emptyBelow).toBe(2);
  });
});
