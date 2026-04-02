import { describe, expect, it } from 'vitest';
import { maxPlaysInSingleDay } from './maxPlaysInSingleDay.ts';

describe('maxPlaysInSingleDay', () => {
  it('returns 0 for empty array', () => {
    expect(maxPlaysInSingleDay([])).toBe(0);
  });

  it('finds the max plays on a single day', () => {
    const dates = [
      new Date('2024-01-15T10:00:00Z'),
      new Date('2024-01-15T14:00:00Z'),
      new Date('2024-01-15T18:00:00Z'),
      new Date('2024-01-16T10:00:00Z'),
    ];
    expect(maxPlaysInSingleDay(dates)).toBe(3);
  });
});
