import { describe, expect, it } from 'vitest';
import { monthIndexFor } from './monthIndexFor.ts';

describe('util: monthIndexFor', () => {
  it('should hold on the first month at the start', () => {
    expect(monthIndexFor(0, 9)).toBe(0);
    expect(monthIndexFor(0.04, 9)).toBe(0);
  });

  it('should end on the last month', () => {
    expect(monthIndexFor(1, 9)).toBe(8);
  });

  it('should step through every month once', () => {
    const indexes = Array.from(
      { length: 101 },
      (_, step) => monthIndexFor(step / 100, 9),
    );

    expect([...new Set(indexes)]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('should handle an empty year', () => {
    expect(monthIndexFor(0.5, 0)).toBe(0);
  });
});
