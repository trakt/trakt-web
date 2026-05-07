import type { HistoryEntry } from '$lib/sections/lists/stores/models/HistoryEntry.ts';
import { describe, expect, it } from 'vitest';
import { getSlotKey } from './getSlotKey.ts';

const entry = (key: string) => ({ key }) as HistoryEntry;

describe('getSlotKey', () => {
  it('returns entry key when nextEntry is null', () => {
    expect(getSlotKey(entry('abc'), null)).toBe('abc');
  });

  it('returns now-prefixed key when entry is null', () => {
    expect(getSlotKey(null, entry('xyz'))).toBe('now-xyz');
  });

  it('returns combined key when both entries are provided', () => {
    expect(getSlotKey(entry('a'), entry('b'))).toBe('a-b');
  });
});
