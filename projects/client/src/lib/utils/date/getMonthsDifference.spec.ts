import { describe, expect, it } from 'vitest';
import { getMonthsDifference } from './getMonthsDifference.ts';

describe('getMonthsDifference', () => {
  it('should count full months only', () => {
    expect(
      getMonthsDifference(new Date('2024-03-14'), new Date('2024-01-15')),
    ).toBe(1);
  });

  it('should ignore the argument order', () => {
    expect(
      getMonthsDifference(new Date('2022-03-01'), new Date('2026-10-01')),
    ).toBe(55);
  });
});
