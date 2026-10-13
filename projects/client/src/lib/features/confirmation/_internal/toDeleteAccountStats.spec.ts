import type { UserStats } from '$lib/requests/models/UserStats.ts';
import { describe, expect, it } from 'vitest';
import { toDeleteAccountStats } from './toDeleteAccountStats.ts';

const NOW = new Date('2026-10-13T12:00:00Z');

const stats = (totalMinutes: number, totalPlays: number) =>
  ({ totalMinutes, totalPlays }) as UserStats;

describe('toDeleteAccountStats', () => {
  it('should count whole years since joining and whole hours watched', () => {
    expect(
      toDeleteAccountStats({
        joinedAt: new Date('2020-08-01T10:00:00Z'),
        stats: stats(128_460, 1832),
        now: NOW,
      }),
    ).toEqual({ years: 6, hours: 2141, plays: 1832 });
  });

  it('should leave out years for an account under a year old', () => {
    expect(
      toDeleteAccountStats({
        joinedAt: new Date('2026-03-01T10:00:00Z'),
        stats: stats(600, 12),
        now: NOW,
      }).years,
    ).toBeNull();
  });

  it('should leave out everything it does not know', () => {
    expect(
      toDeleteAccountStats({ joinedAt: null, stats: null, now: NOW }),
    ).toEqual({ years: null, hours: null, plays: null });
  });

  it('should leave out hours under one hour and zero plays', () => {
    expect(
      toDeleteAccountStats({
        joinedAt: new Date('2019-10-01T10:00:00Z'),
        stats: stats(59, 0),
        now: NOW,
      }),
    ).toEqual({ years: 7, hours: null, plays: null });
  });
});
