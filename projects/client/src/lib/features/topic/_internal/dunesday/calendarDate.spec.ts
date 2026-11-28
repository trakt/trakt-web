import { describe, expect, it } from 'vitest';
import { calendarDate } from './calendarDate.ts';

type HeaderAtParams = { weekStart?: string; index: number };

const headerAt = ({ weekStart, index }: HeaderAtParams) => {
  const week = document.createElement('div');
  if (weekStart) week.dataset.weekStart = weekStart;
  const row = document.createElement('div');
  const days = Array.from({ length: 7 }, () => {
    const day = document.createElement('div');
    const header = document.createElement('div');
    day.append(header);
    return { day, header };
  });
  row.append(...days.map(({ day }) => day));
  week.append(row);

  const target = days.at(index);
  if (!target) throw new Error(`no day at ${index}`);
  return target.header;
};

describe('util: calendarDate', () => {
  it('should offset the week start by the day position', () => {
    const header = headerAt({ weekStart: 'day-2026-11-16', index: 2 });

    expect(calendarDate(header)).toEqual(new Date(2026, 10, 18));
  });

  it('should roll over the end of the month', () => {
    const header = headerAt({ weekStart: 'day-2026-11-29', index: 3 });

    expect(calendarDate(header)).toEqual(new Date(2026, 11, 2));
  });

  it('should accept a week start without the day prefix', () => {
    const header = headerAt({ weekStart: '2026-11-16', index: 0 });

    expect(calendarDate(header)).toEqual(new Date(2026, 10, 16));
  });

  it('should return null without a week start', () => {
    expect(calendarDate(headerAt({ index: 0 }))).toBeNull();
  });

  it('should return null for an unparsable week start', () => {
    expect(
      calendarDate(headerAt({ weekStart: 'day-soon', index: 0 })),
    ).toBeNull();
  });

  it('should return null for a header outside a week', () => {
    expect(calendarDate(document.createElement('div'))).toBeNull();
  });

  it('should read the date from the day anchor of a row header', () => {
    const anchor = document.createElement('div');
    anchor.id = 'day-2026-12-18';
    const rowHeader = document.createElement('div');
    const header = document.createElement('div');
    rowHeader.append(header);
    anchor.append(rowHeader);

    expect(calendarDate(header)).toEqual(new Date(2026, 11, 18));
  });
});
