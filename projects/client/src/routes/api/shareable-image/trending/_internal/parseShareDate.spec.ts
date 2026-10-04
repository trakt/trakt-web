import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { parseShareDate } from './parseShareDate.ts';

const NOW = new Date('2026-10-04T12:00:00Z');

describe('util: parseShareDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should parse a day as midnight UTC', () => {
    expect(parseShareDate('2026-09-15').toISOString()).toBe(
      '2026-09-15T00:00:00.000Z',
    );
  });

  it.each([null, '', 'yesterday', '2026-9-15', '2026-13-45'])(
    'should fall back to now for %s',
    (value) => {
      expect(parseShareDate(value)).toEqual(NOW);
    },
  );
});
