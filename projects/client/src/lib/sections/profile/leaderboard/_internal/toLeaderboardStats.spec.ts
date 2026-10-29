import { describe, expect, it } from 'vitest';
import { toLeaderboardStats } from './toLeaderboardStats.ts';

describe('util: toLeaderboardStats', () => {
  it('should join plays and hours', () => {
    expect(
      toLeaderboardStats({ totalPlays: 9000, totalMinutes: 444_000 }, 'en'),
    ).to.equal('9K plays · 7.4K hours');
  });

  it('should show only the stats that are present', () => {
    expect(
      toLeaderboardStats({ totalPlays: null, totalMinutes: 600 }, 'en'),
    ).to.equal('10 hours');
  });

  it('should be null without any stats', () => {
    expect(
      toLeaderboardStats({ totalPlays: null, totalMinutes: null }, 'en'),
    ).to.equal(null);
  });
});
