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

  it('should return "après-demain" for 2 days difference in French', () => {
    const targetDate = new Date('2023-01-03');
    expect(toHumanETA(today, targetDate, 'ro-ro')).toBe('poimâine');
  });

  it('should return the year for past dates', () => {
    const targetDate = new Date('2022-12-31');
    expect(toHumanETA(today, targetDate, 'en')).toBe('2022');
  });
});
