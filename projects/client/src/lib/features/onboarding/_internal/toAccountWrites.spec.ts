import { buildOnboardingSet } from '$test/beds/onboarding/buildOnboardingSet.ts';
import { describe, expect, it } from 'vitest';
import type { OnboardingSetRecord } from '$lib/features/onboarding/models/OnboardingSetRecord.ts';
import type { OnboardingSignalCounts } from '$lib/features/onboarding/models/OnboardingSignalCounts.ts';
import { resolveSet } from './resolveSet.ts';
import { toAccountWrites } from './toAccountWrites.ts';

const set = buildOnboardingSet({
  id: 'first',
  steps: [
    { id: 'account' },
    {
      id: 'watchlist',
      completesWith: { signal: 'watchlist', mutations: ['watchlist:add'] },
    },
  ],
});

function writesFor({
  record,
  counts = {},
  retiring = [],
}: {
  record: OnboardingSetRecord | null;
  counts?: OnboardingSignalCounts;
  retiring?: ReadonlyArray<string>;
}) {
  return toAccountWrites({
    active: resolveSet({ set, record, counts }),
    retiring,
  });
}

describe('util: toAccountWrites', () => {
  it('should start a set the first time it shows with what is already done', () => {
    expect(writesFor({ record: null })).toEqual([
      { setId: 'first', change: { type: 'start', stepIds: ['account'] } },
    ]);
  });

  it('should complete a set that starts with every step done', () => {
    expect(writesFor({ record: null, counts: { watchlist: 1 } })).toEqual([
      {
        setId: 'first',
        change: { type: 'start', stepIds: ['account', 'watchlist'] },
      },
      { setId: 'first', change: { type: 'complete' } },
    ]);
  });

  it('should store a step the account completed', () => {
    expect(
      writesFor({
        record: {
          startedAt: 0,
          steps: {
            account: { status: 'done', at: 0, source: 'account' },
          },
        },
        counts: { watchlist: 1 },
      }),
    ).toEqual([
      {
        setId: 'first',
        change: { type: 'done', stepId: 'watchlist', source: 'account' },
      },
      { setId: 'first', change: { type: 'complete' } },
    ]);
  });

  it('should write nothing once everything is stored', () => {
    expect(
      writesFor({
        record: {
          startedAt: 0,
          completedAt: 5,
          steps: {
            account: { status: 'done', at: 0, source: 'account' },
            watchlist: { status: 'done', at: 3, source: 'action' },
          },
        },
      }),
    ).toEqual([]);
  });

  it('should complete a set closed by skipping', () => {
    expect(
      writesFor({
        record: {
          startedAt: 0,
          steps: {
            account: { status: 'done', at: 0, source: 'account' },
            watchlist: { status: 'skipped', at: 3 },
          },
        },
      }),
    ).toEqual([{ setId: 'first', change: { type: 'complete' } }]);
  });

  it('should retire the sets the selection reports', () => {
    expect(toAccountWrites({ active: null, retiring: ['first'] })).toEqual([
      { setId: 'first', change: { type: 'retire' } },
    ]);
  });
});
