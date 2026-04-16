import { describe, expect, it } from 'vitest';
import { toHumanDayTime } from './toHumanDayTime.ts';

describe('toHumanDayTime', () => {
  // Fixed date in January (standard time) for deterministic tests.
  const now = new Date('2025-01-06T00:00:00Z');

  it('keeps the same day and time when source and user timezones match', () => {
    const result = toHumanDayTime(
      { day: 'Monday', time: '10:00', timezone: 'UTC', locale: 'en', now },
    );

    expect(result).toEqual({ day: 'Monday', time: '10:00 AM' });
  });

  it('converts across timezones within the same day', () => {
    const result = toHumanDayTime(
      {
        day: 'Monday',
        time: '10:00',
        timezone: 'America/New_York',
        locale: 'en',
        now,
      },
    );

    expect(result).toEqual({ day: 'Monday', time: '3:00 PM' });
  });

  it('wraps the day when the source time crosses midnight UTC', () => {
    const result = toHumanDayTime(
      {
        day: 'Monday',
        time: '22:00',
        timezone: 'America/New_York',
        locale: 'en',
        now,
      },
    );

    expect(result).toEqual({ day: 'Tuesday', time: '3:00 AM' });
  });

  it('uses DST offset when reference date is in summer', () => {
    const summer = new Date('2025-07-07T00:00:00Z');
    const result = toHumanDayTime(
      {
        day: 'Monday',
        time: '10:00',
        timezone: 'America/New_York',
        locale: 'en',
        now: summer,
      },
    );

    expect(result).toEqual({ day: 'Monday', time: '2:00 PM' });
  });

  it('returns undefined for an invalid day', () => {
    const result = toHumanDayTime(
      { day: 'Funday', time: '10:00', timezone: 'UTC', locale: 'en', now },
    );

    expect(result).toBeUndefined();
  });

  it('returns undefined for an invalid time', () => {
    const result = toHumanDayTime(
      { day: 'Monday', time: 'not-a-time', timezone: 'UTC', locale: 'en', now },
    );

    expect(result).toBeUndefined();
  });
});
