import { describe, expect, it } from 'vitest';
import { time } from './time';

describe('time', () => {
  it('should convert seconds to milliseconds', () => {
    expect(time.seconds(1)).toBe(1000);
    expect(time.seconds(2)).toBe(2000);
  });

  it('should convert minutes to milliseconds', () => {
    expect(time.minutes(1)).toBe(60000);
    expect(time.minutes(2)).toBe(120000);
  });

  it('should convert hours to milliseconds', () => {
    expect(time.hours(1)).toBe(3600000);
    expect(time.hours(2)).toBe(7200000);
  });

  it('should convert days to milliseconds', () => {
    expect(time.days(1)).toBe(86400000);
    expect(time.days(2)).toBe(172800000);
  });

  it('should convert weeks to milliseconds', () => {
    expect(time.weeks(1)).toBe(604800000);
    expect(time.weeks(2)).toBe(1209600000);
  });

  it('should convert months to milliseconds', () => {
    expect(time.months(1)).toBe(2592000000);
    expect(time.months(2)).toBe(5184000000);
  });

  it('should convert years to milliseconds', () => {
    expect(time.years(1)).toBe(31536000000);
    expect(time.years(2)).toBe(63072000000);
  });

  it('should convert fps to frame duration in milliseconds', () => {
    expect(time.fps(10)).toBe(100);
    expect(time.fps(50)).toBe(20);
  });
});
