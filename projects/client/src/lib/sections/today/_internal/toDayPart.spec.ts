import { describe, expect, it } from 'vitest';
import { toDayPart } from './toDayPart.ts';

const at = (hour: number) => new Date(2026, 8, 28, hour);

describe('util: toDayPart', () => {
  it.each([
    [5, 'morning'],
    [11, 'morning'],
    [12, 'afternoon'],
    [17, 'afternoon'],
    [18, 'evening'],
    [22, 'evening'],
    [23, 'night'],
    [0, 'night'],
    [4, 'night'],
  ])('should map hour %i to %s', (hour, part) => {
    expect(toDayPart(at(hour))).toBe(part);
  });
});
