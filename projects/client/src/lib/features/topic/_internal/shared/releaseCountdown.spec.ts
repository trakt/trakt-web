import { describe, expect, it } from 'vitest';
import { releaseCountdown } from './releaseCountdown.ts';

const at = (...parts: [number, number, number, number?, number?, number?]) =>
  new Date(...parts).getTime();

describe('util: releaseCountdown', () => {
  it('should split the time left into whole days, hours, minutes and seconds', () => {
    const result = releaseCountdown(at(2026, 11, 16, 21, 58, 55));

    expect(result.wholeDays).toBe(1);
    expect(result.hours).toBe(2);
    expect(result.minutes).toBe(1);
    expect(result.seconds).toBe(5);
    expect(result.released).toBe(false);
  });

  it('should count total hours across days', () => {
    expect(releaseCountdown(at(2026, 11, 16, 0, 0, 0)).totalHours).toBe(48);
  });

  it('should count calendar days from the start of the current day', () => {
    expect(releaseCountdown(at(2026, 11, 17, 23, 59, 59)).calendarDays).toBe(1);
    expect(releaseCountdown(at(2026, 11, 10, 8, 0, 0)).calendarDays).toBe(8);
  });

  it('should be released from midnight on the release day', () => {
    const result = releaseCountdown(at(2026, 11, 18, 0, 0, 0));

    expect(result.released).toBe(true);
    expect(result.calendarDays).toBe(0);
    expect(result.totalHours).toBe(0);
  });

  it('should never go negative after the release day', () => {
    const result = releaseCountdown(at(2027, 0, 5, 12, 0, 0));

    expect(result.released).toBe(true);
    expect(result.calendarDays).toBe(0);
    expect(result.wholeDays).toBe(0);
    expect(result.seconds).toBe(0);
  });
});
