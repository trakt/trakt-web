import { describe, expect, it } from 'vitest';
import { toSettledData } from './toSettledData.ts';

describe('util: toSettledData', () => {
  it('should wait while the query is pending', () => {
    expect(toSettledData({ isPending: true, data: undefined }, 0)).toBeNull();
  });

  it('should return the data once settled', () => {
    expect(toSettledData({ isPending: false, data: 4 }, 0)).toBe(4);
  });

  it('should fall back when the query failed without data', () => {
    expect(toSettledData({ isPending: false, data: undefined }, 0)).toBe(0);
  });
});
