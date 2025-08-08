import { describe, expect, it } from 'vitest';
import { DATE_KEY_PREFIX, dateKey } from './dateKey.ts';

describe('dateKey', () => {
  it('will generate a key for a date', () => {
    const date = new Date('2023-12-20');

    expect(dateKey(date)).toBe(`${DATE_KEY_PREFIX}2023-12-20`);
  });

  it('will handle different times on the same day', () => {
    const morningDate = new Date('2023-12-20T08:00:00');
    const eveningDate = new Date('2023-12-20T20:30:00');

    expect(dateKey(morningDate)).toBe(`${DATE_KEY_PREFIX}2023-12-20`);
    expect(dateKey(eveningDate)).toBe(`${DATE_KEY_PREFIX}2023-12-20`);
  });
});
