import { describe, expect, it } from 'vitest';
import { dateKey } from '../../_internal/dateKey.ts';
import { buildMonthMatrix } from './buildMonthMatrix.ts';

const toDays = (
  weeks: ReadonlyArray<{ cells: ReadonlyArray<{ date: Date }> }>,
) => weeks.map((week) => week.cells.map((cell) => cell.date.getDate()));

describe('util: buildMonthMatrix', () => {
  it('should lay out full weeks starting on the locale first weekday', () => {
    const { weeks } = buildMonthMatrix({
      referenceDate: new Date(2026, 9, 15),
      activeDate: new Date(2026, 9, 15),
      allDays: [],
      localeKey: 'en',
    });

    expect(toDays(weeks)).toEqual([
      [27, 28, 29, 30, 1, 2, 3],
      [4, 5, 6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23, 24],
      [25, 26, 27, 28, 29, 30, 31],
    ]);
  });

  it('should truncate the last week at the end of the month', () => {
    const { weeks } = buildMonthMatrix({
      referenceDate: new Date(2026, 10, 1),
      activeDate: new Date(2026, 10, 1),
      allDays: [],
      localeKey: 'en',
    });

    expect(toDays(weeks).at(-1)).toEqual([29, 30]);
    expect(weeks).toHaveLength(5);
  });

  it('should start on Monday for a Monday-first locale', () => {
    const { weeks } = buildMonthMatrix({
      referenceDate: new Date(2026, 9, 15),
      activeDate: new Date(2026, 9, 15),
      allDays: [],
      localeKey: 'nl-NL',
    });

    expect(toDays(weeks).at(0)).toEqual([28, 29, 30, 1, 2, 3, 4]);
  });

  it('should flag the days outside the month', () => {
    const { weeks } = buildMonthMatrix({
      referenceDate: new Date(2026, 9, 15),
      activeDate: new Date(2026, 9, 15),
      allDays: [],
      localeKey: 'en',
    });

    expect(weeks.at(0)?.cells.map((cell) => cell.isOutsideMonth)).toEqual([
      true,
      true,
      true,
      true,
      false,
      false,
      false,
    ]);
  });

  it('should point at the week containing the active date', () => {
    const { activeWeekIndex } = buildMonthMatrix({
      referenceDate: new Date(2026, 9, 15),
      activeDate: new Date(2026, 9, 20),
      allDays: [],
      localeKey: 'en',
    });

    expect(activeWeekIndex).toBe(3);
  });

  it('should return -1 when the active date is outside the grid', () => {
    const { activeWeekIndex } = buildMonthMatrix({
      referenceDate: new Date(2026, 9, 15),
      activeDate: new Date(2026, 11, 20),
      allDays: [],
      localeKey: 'en',
    });

    expect(activeWeekIndex).toBe(-1);
  });

  it('should key each week by its first day', () => {
    const { weeks } = buildMonthMatrix({
      referenceDate: new Date(2026, 9, 15),
      activeDate: new Date(2026, 9, 15),
      allDays: [],
      localeKey: 'en',
    });

    expect(weeks.at(0)?.key).toBe(dateKey(new Date(2026, 8, 27)));
  });

  it('should attach the items of each day', () => {
    const { weeks } = buildMonthMatrix({
      referenceDate: new Date(2026, 9, 15),
      activeDate: new Date(2026, 9, 15),
      allDays: [{ date: new Date(2026, 9, 12, 20, 30), items: ['episode'] }],
      localeKey: 'en',
    });

    const cell = weeks.flatMap((week) => week.cells).find((c) =>
      c.date.getDate() === 12
    );

    expect(cell?.items).toEqual(['episode']);
    expect(
      weeks.flatMap((week) => week.cells).filter((c) => c.items.length > 0),
    ).toHaveLength(1);
  });
});
