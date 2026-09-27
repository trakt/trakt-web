import { time } from '$lib/utils/timing/time.ts';
import { describe, expect, it } from 'vitest';
import { claimNewReleasePing } from './claimNewReleasePing.ts';

function memoryStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    read: (key: string) => JSON.parse(values.get(key) ?? '{}'),
  };
}

const NOW = Date.UTC(2026, 8, 27);

describe('util: claimNewReleasePing', () => {
  it('should ping the first time an episode is seen', () => {
    const storage = memoryStorage();
    expect(claimNewReleasePing({ key: 'ep-1', storage, now: NOW })).toBe(true);
  });

  it('should not ping the same episode twice', () => {
    const storage = memoryStorage();
    claimNewReleasePing({ key: 'ep-1', storage, now: NOW });
    expect(claimNewReleasePing({ key: 'ep-1', storage, now: NOW + 1000 }))
      .toBe(false);
  });

  it('should forget pings older than a week', () => {
    const storage = memoryStorage();
    claimNewReleasePing({ key: 'ep-1', storage, now: NOW });

    const later = NOW + time.days(8);
    expect(claimNewReleasePing({ key: 'ep-2', storage, now: later })).toBe(
      true,
    );
    expect(storage.read('trakt-new-release-pings')).toEqual({ 'ep-2': later });
  });

  it('should recover from corrupted storage', () => {
    const storage = memoryStorage({ 'trakt-new-release-pings': '{nope' });
    expect(claimNewReleasePing({ key: 'ep-1', storage, now: NOW })).toBe(true);
  });
});
