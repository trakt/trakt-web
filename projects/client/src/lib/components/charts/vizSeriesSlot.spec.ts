import { describe, expect, it } from 'vitest';
import { vizSeriesSlot } from './vizSeriesSlot.ts';

describe('util: vizSeriesSlot', () => {
  it('should map index 0 to slot 1', () => {
    expect(vizSeriesSlot(0)).toBe(1);
  });

  it('should map index 7 to slot 8', () => {
    expect(vizSeriesSlot(7)).toBe(8);
  });

  it('should wrap past eight series', () => {
    expect(vizSeriesSlot(8)).toBe(1);
    expect(vizSeriesSlot(9)).toBe(2);
  });

  it('should wrap negative indices', () => {
    expect(vizSeriesSlot(-1)).toBe(8);
  });

  it('should always land within 1..8', () => {
    for (let i = 0; i < 100; i++) {
      const slot = vizSeriesSlot(i);
      expect(slot).toBeGreaterThanOrEqual(1);
      expect(slot).toBeLessThanOrEqual(8);
    }
  });
});
