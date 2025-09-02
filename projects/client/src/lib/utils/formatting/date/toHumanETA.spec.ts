import { describe, expect, it } from 'vitest';
import { toHumanETA } from './toHumanETA.ts';

describe('toHumanETA', () => {
  const today = new Date('2023-01-01');

  it('should return "tomorrow" for 1 day difference', () => {
    const targetDate = new Date('2023-01-02');
    expect(toHumanETA(today, targetDate, 'en')).toBe('tomorrow');
  });

  it('should return "in 2 days" for 2 days difference', () => {
    const targetDate = new Date('2023-01-03');
    expect(toHumanETA(today, targetDate, 'en')).toBe('in 2 days');
  });

  it('should return "next week" for 7 days difference', () => {
    const targetDate = new Date('2023-01-08');
    expect(toHumanETA(today, targetDate, 'en')).toBe('next week');
  });

  it('should return "in 2 weeks" for 14 days difference', () => {
    const targetDate = new Date('2023-01-15');
    expect(toHumanETA(today, targetDate, 'en')).toBe('in 2 weeks');
  });

  it('should return "next month" for 30 days difference', () => {
    const targetDate = new Date('2023-01-31');
    expect(toHumanETA(today, targetDate, 'en')).toBe('next month');
  });

  it('should return "in 2 months" for 60 days difference', () => {
    const targetDate = new Date('2023-03-02');
    expect(toHumanETA(today, targetDate, 'en')).toBe('in 2 months');
  });

  it('should return "2024" for more than 6 months difference', () => {
    const targetDate = new Date('2024-01-01');
    expect(toHumanETA(today, targetDate, 'en')).toBe('2024');
  });

  it('should return "après-demain" for 2 days difference in French', () => {
    const targetDate = new Date('2023-01-03');
    expect(toHumanETA(today, targetDate, 'fr-fr')).toBe('après-demain');
  });

  it('should return "poimâine" for 2 days difference in Romanian', () => {
    const targetDate = new Date('2023-01-03');
    expect(toHumanETA(today, targetDate, 'ro-ro')).toBe('poimâine');
  });

  it('should return the year for past dates', () => {
    const targetDate = new Date('2022-12-31');
    expect(toHumanETA(today, targetDate, 'en')).toBe('2022');
  });

  it('should round up fractional days (2.16 days becomes 3 days)', () => {
    const today = new Date('2025-06-23T18:51:30.828Z');
    const targetDate = new Date('2025-06-26T01:00:00.000Z');
    expect(toHumanETA(today, targetDate, 'en')).toBe('in 3 days');
  });

  it('should round up small fractional days when target is after midnight', () => {
    console.log('Testing small fractional days');
    const today = new Date('2023-01-01T22:00:00.000Z');
    const targetDate = new Date('2023-01-02T00:24:00.000Z');
    expect(toHumanETA(today, targetDate, 'en')).toBe('tomorrow');
  });

  it('should round up fractional days for weeks (7.5 days becomes 8 days, which is still 1 week)', () => {
    const today = new Date('2023-01-01T00:00:00.000Z');
    const targetDate = new Date('2023-01-08T12:00:00.000Z');
    expect(toHumanETA(today, targetDate, 'en')).toBe('next week');
  });

  it('should handle same day but later time in hours', () => {
    const today = new Date('2023-01-01T10:00:00.000Z');
    const targetDate = new Date('2023-01-01T23:59:59.999Z');
    expect(toHumanETA(today, targetDate, 'en')).toBe('in 14 hours');
  });

  it('should return "in 1 hour" for 1 hour difference', () => {
    const today = new Date('2023-01-01T10:00:00.000Z');
    const targetDate = new Date('2023-01-01T11:00:00.000Z');
    expect(toHumanETA(today, targetDate, 'en')).toBe('in 1 hour');
  });

  it('should return "in 5 hours" for 5 hour difference', () => {
    const today = new Date('2023-01-01T10:00:00.000Z');
    const targetDate = new Date('2023-01-01T15:00:00.000Z');
    expect(toHumanETA(today, targetDate, 'en')).toBe('in 5 hours');
  });

  it('should return "tomorrow" for 23 hour difference when target is after midnight', () => {
    const today = new Date('2023-01-01T01:00:00.000Z');
    const targetDate = new Date('2023-01-02T00:00:00.000Z');
    expect(toHumanETA(today, targetDate, 'en')).toBe('tomorrow');
  });

  it('should round up fractional hours (2.3 hours becomes 3 hours)', () => {
    const today = new Date('2023-01-01T10:00:00.000Z');
    const targetDate = new Date('2023-01-01T12:18:00.000Z');
    expect(toHumanETA(today, targetDate, 'en')).toBe('in 2 hours');
  });

  it('should return "in 6m" for small fractional hours (0.1 hours)', () => {
    const today = new Date('2023-01-01T10:00:00.000Z');
    const targetDate = new Date('2023-01-01T10:06:00.000Z');
    expect(toHumanETA(today, targetDate, 'en')).toBe('in 6m');
  });

  it('should switch to days when 24+ hours (25 hours becomes tomorrow)', () => {
    const today = new Date('2023-01-01T10:00:00.000Z');
    const targetDate = new Date('2023-01-02T10:00:00.000Z');
    expect(toHumanETA(today, targetDate, 'en')).toBe('tomorrow');
  });

  it('should account for weeks overflowing', () => {
    [
      {
        'today': '2025-06-28T10:00:00.000Z',
        'target': '2025-07-07T10:00:00.000Z',
        'expected': 'in 2 weeks',
      },
      {
        'today': '2025-06-30T10:00:00.000Z',
        'target': '2025-07-13T10:00:00.000Z',
        'expected': 'next week',
      },
      {
        'today': '2025-06-30T10:00:00.000Z',
        'target': '2025-07-14T10:00:00.000Z',
        'expected': 'in 2 weeks',
      },
      {
        'today': '2025-06-30T10:00:00.000Z',
        'target': '2025-07-15T10:00:00.000Z',
        'expected': 'in 2 weeks',
      },
    ].forEach(({ today, target, expected }) => {
      const todayDate = new Date(today);
      const targetDate = new Date(target);
      expect(toHumanETA(todayDate, targetDate, 'en')).toBe(expected);
    });
  });
});
