import { describe, expect, it } from 'vitest';
import { toHumanDate } from '$lib/utils/date/toHumanDate.ts';

function stripTime(date: Date): Date {
  return new Date(date.toDateString());
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

describe('toHumanDate', () => {
  it('will display Sunday at 12:00 AM', () => {
    const today = stripTime(new Date());
    const nextSunday = addDays(today, 7 - today.getDay());

    expect(toHumanDate(today, nextSunday, 'en')).toBe('Sunday at 12:00 AM');
  });

  it('will display tomorrow at 12:00 AM', () => {
    const today = stripTime(new Date());
    const nextMonday = addDays(today, 1);

    expect(toHumanDate(today, nextMonday, 'en')).toBe('tomorrow at 12:00 AM');
  });

  it('will display yesterday at 12:00 AM', () => {
    const today = stripTime(new Date());
    const yesterday = addDays(today, -1);

    expect(toHumanDate(today, yesterday, 'en')).toBe('yesterday at 12:00 AM');
  });

  it('will display the relative date if it is 6 days in the future', () => {
    const wednesday = stripTime(new Date('2023-12-20'));

    const nextWeek = addDays(wednesday, 6);

    expect(toHumanDate(wednesday, nextWeek, 'en')).toBe(
      'Tuesday at 12:00 AM',
    );
  });

  it('will display the relative date if it is 6 days in the past', () => {
    const wednesday = stripTime(new Date('2023-12-20'));

    const previousWeek = addDays(wednesday, -6);

    expect(toHumanDate(wednesday, previousWeek, 'en')).toBe(
      'last Thursday at 12:00 AM',
    );
  });

  it('will display the date in the past if is more than 1 week ago', () => {
    const wednesday = stripTime(new Date('2023-12-20'));

    const previousWeek = addDays(wednesday, -7);

    expect(toHumanDate(wednesday, previousWeek, 'en')).toBe(
      'December 13th, 2023 at 12:00 AM',
    );
  });

  it('will display the date in the future if is more than 1 week in the future', () => {
    const wednesday = stripTime(new Date('2023-12-20'));

    const nextWeek = addDays(wednesday, 7);

    expect(toHumanDate(wednesday, nextWeek, 'en')).toBe(
      'December 27th, 2023 at 12:00 AM',
    );
  });

  it.only('will display the date in the past if is more than strictly more 6 days ', () => {
    const wednesday = stripTime(new Date('2023-12-20'));

    const previousWeek = addHours(addDays(wednesday, -6), -4);

    expect(toHumanDate(wednesday, previousWeek, 'en')).toBe(
      'December 13th, 2023 at 8:00 PM',
    );
  });
});
