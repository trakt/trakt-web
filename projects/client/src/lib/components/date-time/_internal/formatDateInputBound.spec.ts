import { describe, expect, it } from 'vitest';
import type { DateInputType } from './DateInputProps.ts';
import { formatDateInputBound } from './formatDateInputBound.ts';

describe('util: formatDateInputBound', () => {
  const date = new Date(2026, 7, 27, 1, 30, 45);
  const bound = (type: DateInputType, edge: 'min' | 'max') =>
    formatDateInputBound({ date, type, edge });

  describe('for datetime-local', () => {
    it('should widen a lower bound to the start of its day', () => {
      expect(bound('datetime-local', 'min')).toBe('2026-08-27T00:00');
    });

    it('should widen an upper bound to the end of its day', () => {
      expect(bound('datetime-local', 'max')).toBe('2026-08-27T23:59');
    });
  });

  describe('for date', () => {
    it('should leave a lower bound untouched', () => {
      expect(bound('date', 'min')).toBe('2026-08-27');
    });

    it('should leave an upper bound untouched', () => {
      expect(bound('date', 'max')).toBe('2026-08-27');
    });
  });

  it('should return undefined when there is no bound', () => {
    expect(
      formatDateInputBound({
        date: undefined,
        type: 'datetime-local',
        edge: 'max',
      }),
    ).toBeUndefined();
  });
});
