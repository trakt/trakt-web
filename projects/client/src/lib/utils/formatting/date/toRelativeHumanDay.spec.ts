import { describe, expect, it } from 'vitest';
import { toRelativeHumanDay } from './toRelativeHumanDay.ts';

function stripTime(date: Date): Date {
  return new Date(date.toDateString());
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

describe('toRelativeHumanDay', () => {
  it('displays today as Today', () => {
    const today = stripTime(new Date());
    expect(toRelativeHumanDay(today, today, 'en')).toBe('today');
  });

  it('displays earlier in the day as Today', () => {
    const today = new Date();
    today.setHours(21, 49, 0, 0);

    const earlierToday = new Date();
    earlierToday.setHours(7, 39, 0, 0);
    expect(toRelativeHumanDay(today, earlierToday, 'en')).toBe('today');
  });

  it('displays tomorrow as Tomorrow', () => {
    const today = stripTime(new Date());
    const tomorrow = addDays(today, 1);
    expect(toRelativeHumanDay(today, tomorrow, 'en')).toBe('tomorrow');
  });

  it('displays yesterday as Yesterday', () => {
    const today = stripTime(new Date());
    const yesterday = addDays(today, -1);
    expect(toRelativeHumanDay(today, yesterday, 'en')).toBe('yesterday');
  });

  it('displays last weekday for past days in range', () => {
    const wednesday = stripTime(new Date('2023-12-20'));

    const previousWeek = addDays(wednesday, -6);
    expect(toRelativeHumanDay(wednesday, previousWeek, 'en')).toBe(
      'last Thursday',
    );
  });

  it('displays formatted date for dates more than a week ago', () => {
    const today = stripTime(new Date('2023-12-20'));
    const previousWeek = addDays(today, -7);
    expect(toRelativeHumanDay(today, previousWeek, 'en')).toBe(
      'December 13th, 2023',
    );
  });

  it('displays formatted date for dates more than a week in the future', () => {
    const today = stripTime(new Date('2023-12-20'));
    const nextWeek = addDays(today, 7);
    expect(toRelativeHumanDay(today, nextWeek, 'en')).toBe(
      'December 27th, 2023',
    );
  });

  it('displays formatted date for dates more than 2 months ago', () => {
    const today = stripTime(new Date('2023-12-20'));
    const twoMonthAgo = addDays(today, -60);
    expect(toRelativeHumanDay(today, twoMonthAgo, 'en')).toBe(
      'October 21st, 2023',
    );
  });
});
