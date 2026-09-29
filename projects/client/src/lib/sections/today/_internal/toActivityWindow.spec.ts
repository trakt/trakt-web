import { describe, expect, it } from 'vitest';
import { toActivityWindow } from './toActivityWindow.ts';

const start = new Date('2026-09-28T00:00:00.000Z');
const end = new Date('2026-09-28T23:59:59.999Z');

describe('util: toActivityWindow', () => {
  it('should leave the rolling window unbounded', () => {
    expect(toActivityWindow({ start, end, isRolling: true })).toEqual({});
  });

  it('should bound a past day by its start and end', () => {
    expect(toActivityWindow({ start, end, isRolling: false })).toEqual({
      startDate: start,
      endDate: end,
    });
  });
});
