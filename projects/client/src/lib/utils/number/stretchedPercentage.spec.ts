import { describe, expect, it } from 'vitest';
import { stretchedPercentage } from './stretchedPercentage.ts';

describe('stretchedPercentage', () => {
  it('should return 50 when value is half of total', () => {
    expect(stretchedPercentage({ value: 50, total: 100 })).toBe(50);
  });

  it('should be symmetrical around 50%', () => {
    const below = stretchedPercentage({ value: 40, total: 100 });
    const above = stretchedPercentage({ value: 60, total: 100 });
    expect(50 - below).toEqual(above - 50);
  });

  it('should emphasize lower values', () => {
    expect(stretchedPercentage({ value: 5, total: 100 })).toBeCloseTo(14.19);
    expect(stretchedPercentage({ value: 10, total: 100 })).toBeCloseTo(16.80);
    expect(stretchedPercentage({ value: 15, total: 100 })).toBeCloseTo(19.78);
    expect(stretchedPercentage({ value: 20, total: 100 })).toBeCloseTo(23.15);
    expect(stretchedPercentage({ value: 25, total: 100 })).toBeCloseTo(26.89);
    expect(stretchedPercentage({ value: 30, total: 100 })).toBeCloseTo(31.00);
    expect(stretchedPercentage({ value: 35, total: 100 })).toBeCloseTo(35.43);
    expect(stretchedPercentage({ value: 40, total: 100 })).toBeCloseTo(40.13);
  });

  it('should de-emphasize higher values', () => {
    expect(stretchedPercentage({ value: 95, total: 100 })).toBeCloseTo(85.81);
    expect(stretchedPercentage({ value: 90, total: 100 })).toBeCloseTo(83.20);
    expect(stretchedPercentage({ value: 85, total: 100 })).toBeCloseTo(80.22);
    expect(stretchedPercentage({ value: 80, total: 100 })).toBeCloseTo(76.85);
    expect(stretchedPercentage({ value: 75, total: 100 })).toBeCloseTo(73.11);
    expect(stretchedPercentage({ value: 70, total: 100 })).toBeCloseTo(69.00);
    expect(stretchedPercentage({ value: 65, total: 100 })).toBeCloseTo(64.57);
    expect(stretchedPercentage({ value: 60, total: 100 })).toBeCloseTo(59.87);
  });
});
