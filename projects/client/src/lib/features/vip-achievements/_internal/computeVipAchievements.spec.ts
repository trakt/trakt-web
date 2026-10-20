import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type { UserStats } from '$lib/requests/models/UserStats.ts';
import { describe, expect, it } from 'vitest';
import { achievementCatalog } from './achievementCatalog.ts';
import { computeVipAchievements } from './computeVipAchievements.ts';
import type { VipAchievementMetricInput } from './VipAchievementMetricInput.ts';

function makeInput(
  overrides: Partial<VipAchievementMetricInput> = {},
): VipAchievementMetricInput {
  return {
    stats: null,
    history: null,
    ratings: null,
    milestones: null,
    ...overrides,
  };
}

function makeRatings(values: number[]): UserRatings {
  return {
    movies: new Map(
      values.map((rating, index) => [
        index,
        {
          id: index,
          rating,
          ratedAt: new Date(0),
        },
      ]),
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

const byId =
  (id: string) => (list: ReturnType<typeof computeVipAchievements>) =>
    list.find((achievement) => achievement.id === id);

describe('util: computeVipAchievements', () => {
  it('resolves one entry per catalog achievement', () => {
    expect(computeVipAchievements(makeInput())).toHaveLength(
      achievementCatalog.length,
    );
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

  it('measures watch time in whole hours', () => {
    const stats = makeStats({
      episodes: {
        plays: 0,
        watched: 0,
        minutes: 30_059,
        ratings: 0,
        comments: 0,
      },
    });
    const tv = byId('time-spent-episodes')(
      computeVipAchievements(makeInput({ stats })),
    );

    expect(tv?.value).toBe(500);
    expect(tv?.isUnlocked).toBe(true);
  });

  it('derives ratings metrics from the loaded ratings', () => {
    const ratings = makeRatings([10, 10, 3, 7, 10]);
    const list = computeVipAchievements(makeInput({ ratings }));

    expect(byId('perfect-ten')(list)?.value).toBe(3);
    expect(byId('rating-machine')(list)?.value).toBe(5);
  });

  it('sums comments across every media type', () => {
    const stats = makeStats({
      movies: { plays: 0, watched: 0, minutes: 0, ratings: 0, comments: 2 },
      shows: { watched: 0, ratings: 0, comments: 1 },
      seasons: { ratings: 0, comments: 1 },
      episodes: { plays: 0, watched: 0, minutes: 0, ratings: 0, comments: 1 },
    });

    expect(
      byId('scribe')(computeVipAchievements(makeInput({ stats })))?.value,
    ).toBe(5);
  });

  it('describes the step to the next tier', () => {
    const locked = computeVipAchievements(makeInput());
    const unlocked = computeVipAchievements(
      makeInput({ stats: makeStats({ lists: 3 }) }),
    );
    const maxed = computeVipAchievements(
      makeInput({ stats: makeStats({ lists: 25 }) }),
    );

    expect(byId('list-maker')(locked)?.nextStep).toBe('Create 3 lists');
    expect(byId('list-maker')(unlocked)?.nextStep).toBe('Create 10 lists');
    expect(byId('list-maker')(maxed)?.nextStep).toBeNull();
  });

  it('words a single first step without a count', () => {
    const locked = computeVipAchievements(makeInput());
    const unlocked = computeVipAchievements(
      makeInput({ ratings: makeRatings([10]) }),
    );

    expect(byId('perfect-ten')(locked)?.nextStep).toBe(
      'Give something a perfect 5/5',
    );
    expect(byId('perfect-ten')(unlocked)?.nextStep).toBe(
      'Give 10 perfect 5/5 ratings',
    );
  });

  it('groups thresholds in the step copy', () => {
    const list = computeVipAchievements(
      makeInput({ stats: makeStats({ totalPlays: 1_000 }) }),
    );

    expect(byId('century-club')(list)?.nextStep).toBe('Log 5,000 plays');
  });

  it('unlocks Opening Credits from its milestone', () => {
    const locked = computeVipAchievements(makeInput());
    const earned = computeVipAchievements(
      makeInput({ milestones: new Set(['opening-credits']) }),
    );

    expect(byId('opening-credits')(locked)?.isUnlocked).toBe(false);
    expect(byId('opening-credits')(locked)?.nextStep).toBe(
      'Finish the first steps in Getting started',
    );
    expect(byId('opening-credits')(earned)?.isUnlocked).toBe(true);
    expect(byId('opening-credits')(earned)?.isMaxed).toBe(true);
  });

  it('lists Opening Credits first', () => {
    expect(computeVipAchievements(makeInput()).at(0)?.id).toBe(
      'opening-credits',
    );
  });

  it('degrades to all-locked with no data', () => {
    const list = computeVipAchievements(makeInput());
    expect(list.every((achievement) => !achievement.isUnlocked)).toBe(true);
  });
});
