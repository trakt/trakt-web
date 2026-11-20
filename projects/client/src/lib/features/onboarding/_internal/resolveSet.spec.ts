import { buildOnboardingSet } from '$test/beds/onboarding/buildOnboardingSet.ts';
import { describe, expect, it } from 'vitest';
import { resolveSet } from './resolveSet.ts';

const set = buildOnboardingSet({
  steps: [
    { id: 'account', skippable: false },
    {
      id: 'watchlist',
      completesWith: { signal: 'watchlist', mutations: ['watchlist:add'] },
    },
    {
      id: 'follow',
      completesWith: { signal: 'following', mutations: ['user:follow'] },
    },
  ],
});

describe('util: resolveSet', () => {
  it('should count a fresh set as open', () => {
    const progress = resolveSet({ set, record: null, counts: {} });

    expect(progress.done).toBe(1);
    expect(progress.remaining).toBe(2);
    expect(progress.isClosed).toBe(false);
    expect(progress.isEarned).toBe(false);
  });

  it('should close without earning when the rest is skipped', () => {
    const progress = resolveSet({
      set,
      record: {
        startedAt: 0,
        steps: {
          watchlist: { status: 'skipped', at: 1 },
          follow: { status: 'skipped', at: 2 },
        },
      },
      counts: {},
    });

    expect(progress.skipped).toBe(2);
    expect(progress.isClosed).toBe(true);
    expect(progress.isEarned).toBe(false);
  });

  it('should earn the set once every step is done', () => {
    const progress = resolveSet({
      set,
      record: {
        startedAt: 0,
        steps: { follow: { status: 'done', at: 1, source: 'action' } },
      },
      counts: { watchlist: 3 },
    });

    expect(progress.done).toBe(3);
    expect(progress.isEarned).toBe(true);
  });

  it('should carry the record it was resolved from', () => {
    const record = { startedAt: 5, steps: {} };

    expect(resolveSet({ set, record, counts: {} }).record).toBe(record);
  });
});
