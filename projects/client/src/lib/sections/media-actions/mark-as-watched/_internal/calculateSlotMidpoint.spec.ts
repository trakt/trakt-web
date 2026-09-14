import { describe, expect, it } from 'vitest';
import { calculateSlotMidpoint } from './calculateSlotMidpoint.ts';

describe('calculateSlotMidpoint', () => {
  it('should return the midpoint between both dates', () => {
    const start = new Date('2024-01-01T00:00:00.000Z');
    const end = new Date('2024-01-03T00:00:00.000Z');

    expect(calculateSlotMidpoint(start, end)).toEqual(
      new Date('2024-01-02T00:00:00.000Z'),
    );
  });

  it('should handle reversed date order', () => {
    const start = new Date('2024-06-10T00:00:00.000Z');
    const end = new Date('2024-06-01T00:00:00.000Z');

    expect(calculateSlotMidpoint(start, end)).toEqual(
      new Date('2024-06-05T12:00:00.000Z'),
    );
  });

  it('should handle equal dates (zero-width range)', () => {
    const date = new Date('2024-01-01T00:00:00.000Z');

    expect(calculateSlotMidpoint(date, date)).toEqual(date);
  });
});
