import { describe, expect, it } from 'vitest';
import { pickDailyEntry } from './pickDailyEntry.ts';

const ENTRIES = ['a', 'b', 'c'];

describe('util: pickDailyEntry', () => {
  it('should return undefined when there are no entries', () => {
    expect(pickDailyEntry({ entries: [], date: new Date() })).toBeUndefined();
  });

  it('should keep the same pick throughout a day', () => {
    const morning = pickDailyEntry({
      entries: ENTRIES,
      date: new Date('2026-10-04T00:00:01Z'),
    });
    const evening = pickDailyEntry({
      entries: ENTRIES,
      date: new Date('2026-10-04T23:59:59Z'),
    });

    expect(morning).toBe(evening);
  });

  it('should rotate the pick on the next day', () => {
    const today = pickDailyEntry({
      entries: ENTRIES,
      date: new Date('2026-10-04T12:00:00Z'),
    });
    const tomorrow = pickDailyEntry({
      entries: ENTRIES,
      date: new Date('2026-10-05T12:00:00Z'),
    });

    expect(tomorrow).not.toBe(today);
  });
});
