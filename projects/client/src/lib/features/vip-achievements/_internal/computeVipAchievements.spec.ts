import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type { UserLimits } from '$lib/requests/models/UserLimits.ts';
import type { UserStats } from '$lib/requests/models/UserStats.ts';
import type { VipSubscription } from '$lib/requests/models/VipSubscription.ts';
import { describe, expect, it } from 'vitest';
import { GRACE_PERIOD_MS } from './constants.ts';
import { computeVipAchievements } from './computeVipAchievements.ts';
import type { VipAchievementMetricInput } from './VipAchievementMetricInput.ts';

const NOW = new Date('2026-07-30T00:00:00.000Z').getTime();

function makeInput(
  overrides: Partial<VipAchievementMetricInput> = {},
): VipAchievementMetricInput {
  return {
    subscription: null,
    profile: null,
    stats: null,
    history: null,
    ratings: null,
    limits: null,
    plexLibrary: null,
    now: NOW,
    ...overrides,
  };
}

function makeSubscription(
  overrides: Partial<VipSubscription> = {},
): VipSubscription {
  return {
    type: 'yearly',
    plan: 'VIP',
    memberSince: new Date('2019-01-01T00:00:00.000Z'),
    renewsAt: new Date('2027-01-01T00:00:00.000Z'),
    expiresAt: new Date('2027-01-01T00:00:00.000Z'),
    gateway: 'stripe',
    isCancelled: false,
    vipYears: 5,
    daysLeft: 120,
    renewalPrice: null,
    manageUrl: null,
    transactions: [],
    ...overrides,
  };
}

function makeRatings(values: number[]): UserRatings {
  return {
    movies: new Map(
      values.map((rating, index) => [index, {
        id: index,
        rating,
        ratedAt: new Date(0),
      }]),
    ),
    shows: new Map(),
    seasons: new Map(),
    episodes: new Map(),
  };
}

function makeStats(overrides: Partial<UserStats> = {}): UserStats {
  return {
    movies: { plays: 0, watched: 0, minutes: 0, ratings: 0, comments: 0 },
    shows: { watched: 0, ratings: 0, comments: 0 },
    seasons: { ratings: 0, comments: 0 },
    episodes: { plays: 0, watched: 0, minutes: 0, ratings: 0, comments: 0 },
    network: { followers: 0, following: 0 },
    ratings: {
      total: 0,
      distribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
      },
    },
    progress: { started: 0, finished: 0, dropped: 0 },
    lists: 0,
    totalMinutes: 0,
    totalPlays: 0,
    ...overrides,
  };
}

function makeLimits(
  current: Partial<Record<keyof UserLimits, number>>,
): UserLimits {
  const domain = (key: keyof UserLimits) => ({
    current: current[key] ?? 0,
    free: 100,
    vip: 100_000,
  });
  return {
    history: domain('history'),
    ratings: domain('ratings'),
    watchlistItems: domain('watchlistItems'),
    totalListItems: domain('totalListItems'),
    staticLists: domain('staticLists'),
    dynamicLists: domain('dynamicLists'),
    digitalLibrary: domain('digitalLibrary'),
    totalNotes: domain('totalNotes'),
    connectedApps: domain('connectedApps'),
  };
}

const byId =
  (id: string) => (list: ReturnType<typeof computeVipAchievements>) =>
    list.find((achievement) => achievement.id === id);

describe('util: computeVipAchievements', () => {
  it('resolves one entry per catalog achievement', () => {
    expect(computeVipAchievements(makeInput())).toHaveLength(24);
  });

  it('resolves tier index, next threshold and progress for a tiered metric', () => {
    // century-club thresholds [1000, 5000, 25000, 100000]; 3000 plays.
    const club = byId('century-club')(
      computeVipAchievements(
        makeInput({ stats: makeStats({ totalPlays: 3000 }) }),
      ),
    );

    expect(club?.tierIndex).toBe(0); // cleared 1000, not 5000
    expect(club?.tierCount).toBe(4);
    expect(club?.nextThreshold).toBe(5000);
    expect(club?.progress).toBeCloseTo((3000 - 1000) / (5000 - 1000));
    expect(club?.isUnlocked).toBe(true);
    expect(club?.isMaxed).toBe(false);
  });

  it('derives ratings metrics from the loaded ratings', () => {
    const ratings = makeRatings([10, 10, 3, 7, 10]);
    const list = computeVipAchievements(makeInput({ ratings }));

    expect(byId('perfect-ten')(list)?.value).toBe(3);
    expect(byId('harsh-critic')(list)?.value).toBe(1);
    expect(byId('rating-machine')(list)?.value).toBe(5);
  });

  it('unlocks balanced-critic only with a rating at every score', () => {
    const full = makeRatings([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const partial = makeRatings([1, 2, 3, 4, 5]);

    expect(
      byId('balanced-critic')(
        computeVipAchievements(makeInput({ ratings: full })),
      )
        ?.isUnlocked,
    ).toBe(true);
    expect(
      byId('balanced-critic')(
        computeVipAchievements(makeInput({ ratings: partial })),
      )?.isUnlocked,
    ).toBe(false);
  });

  it('counts rewatches from stats plays minus distinct watched', () => {
    const stats = makeStats({
      movies: { plays: 30, watched: 20, minutes: 0, ratings: 0, comments: 0 },
      episodes: { plays: 15, watched: 10, minutes: 0, ratings: 0, comments: 0 },
    });

    expect(
      byId('re-watcher')(computeVipAchievements(makeInput({ stats })))?.value,
    )
      .toBe(15);
  });

  it('unlocks vip-limit-breaker when a usage exceeds its free ceiling', () => {
    const over = makeLimits({ history: 250 }); // free ceiling 100
    const under = makeLimits({ history: 50 });

    expect(
      byId('vip-limit-breaker')(
        computeVipAchievements(makeInput({ limits: over })),
      )
        ?.isUnlocked,
    ).toBe(true);
    expect(
      byId('vip-limit-breaker')(
        computeVipAchievements(makeInput({ limits: under })),
      )?.isUnlocked,
    ).toBe(false);
  });

  it('resolves VIP prestige metrics', () => {
    const list = computeVipAchievements(makeInput({
      subscription: makeSubscription({ vipYears: 5, type: 'life' }),
      profile: {
        isDirector: true,
        joinedAt: new Date('2016-07-30T00:00:00.000Z'),
      },
    }));

    expect(byId('vip-loyalty')(list)?.value).toBe(5);
    expect(byId('vip-loyalty')(list)?.tierIndex).toBe(1); // clears 2, 5
    expect(byId('trakt-veteran')(list)?.value).toBe(10);
    expect(byId('life-backer')(list)?.isUnlocked).toBe(true);
    expect(byId('director-flair')(list)?.isUnlocked).toBe(true);
  });

  it('freezes only unlocked freezable achievements within the grace window', () => {
    const list = computeVipAchievements(makeInput({
      subscription: makeSubscription({
        vipYears: 5,
        expiresAt: new Date(NOW - GRACE_PERIOD_MS / 2),
      }),
    }));

    // vip-loyalty is freezable + unlocked -> frozen.
    expect(byId('vip-loyalty')(list)?.isFrozen).toBe(true);
    // director-flair is not freezable.
    expect(byId('director-flair')(list)?.isFrozen).toBe(false);
    // phoenix-rescue unlocks from being in grace.
    expect(byId('phoenix-rescue')(list)?.isUnlocked).toBe(true);
  });

  it('degrades to all-locked with no data', () => {
    const list = computeVipAchievements(makeInput());
    expect(list.every((achievement) => !achievement.isUnlocked)).toBe(true);
  });
});
