import { describe, expect, it } from 'vitest';
import { toHumanDayOfWeek } from './toHumanDayOfWeek.ts';

describe('toHumanDayOfWeek', () => {
  it('will display Monday for a Monday date', () => {
    const monday = new Date('2023-12-18');

    expect(toHumanDayOfWeek(monday, 'en')).toBe('Mon');
  });

  it('will display Tuesday for a Tuesday date', () => {
    const tuesday = new Date('2023-12-19');

    expect(toHumanDayOfWeek(tuesday, 'en')).toBe('Tue');
  });

  it('will display Wednesday for a Wednesday date', () => {
    const wednesday = new Date('2023-12-20');
    expect(toHumanDayOfWeek(wednesday, 'en')).toBe('Wed');
  });

  it('will display Thursday for a Thursday date', () => {
    const thursday = new Date('2023-12-21');

    expect(toHumanDayOfWeek(thursday, 'en')).toBe('Thu');
  });

  it('will display Friday for a Friday date', () => {
    const friday = new Date('2023-12-22');

    expect(toHumanDayOfWeek(friday, 'en')).toBe('Fri');
  });

  it('will display Saturday for a Saturday date', () => {
    const saturday = new Date('2023-12-23');

    expect(toHumanDayOfWeek(saturday, 'en')).toBe('Sat');
  });

  it('will display Sunday for a Sunday date', () => {
    const sunday = new Date('2023-12-24');

    expect(toHumanDayOfWeek(sunday, 'en')).toBe('Sun');
  });

  it('will handle different times on the same day', () => {
    const morningWednesday = new Date('2023-12-20T08:00:00');
    const eveningWednesday = new Date('2023-12-20T20:30:00');

    expect(toHumanDayOfWeek(morningWednesday, 'en')).toBe('Wed');
    expect(toHumanDayOfWeek(eveningWednesday, 'en')).toBe('Wed');
  });

  it('will handle leap year dates correctly', () => {
    const leapYearDate = new Date('2024-02-29');

    expect(toHumanDayOfWeek(leapYearDate, 'en')).toBe('Thu');
  });

  it('will handle other locales', () => {
    const tuesday = new Date('2023-12-19');

    expect(toHumanDayOfWeek(tuesday, 'nl-nl')).toBe('din');
    expect(toHumanDayOfWeek(tuesday, 'de-de')).toBe('Di.');
  });
});
