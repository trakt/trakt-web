import { buildOnboardingSet } from '$test/beds/onboarding/buildOnboardingSet.ts';
import { describe, expect, it } from 'vitest';
import type { OnboardingSetRecord } from '$lib/features/onboarding/models/OnboardingSetRecord.ts';
import { resolveStep } from './resolveStep.ts';

const set = buildOnboardingSet({
  steps: [
    { id: 'account' },
    {
      id: 'watchlist',
      completesWith: { signal: 'watchlist', mutations: ['watchlist:add'] },
    },
  ],
});
const [account, watchlist] = set.steps;

function record(steps: OnboardingSetRecord['steps']): OnboardingSetRecord {
  return { startedAt: 0, steps };
}

describe('util: resolveStep', () => {
  it('should mark an always step as done', () => {
    expect(
      account && resolveStep({ step: account, record: null, counts: {} }),
    ).toBe('done');
  });

  it('should be todo while the signal is empty', () => {
    expect(
      watchlist && resolveStep({ step: watchlist, record: null, counts: {} }),
    ).toBe('todo');
  });

  it('should be done once the signal counts something', () => {
    expect(
      watchlist &&
        resolveStep({
          step: watchlist,
          record: null,
          counts: { watchlist: 1 },
        }),
    ).toBe('done');
  });

  it('should stay done once stored, even when the signal drops', () => {
    expect(
      watchlist &&
        resolveStep({
          step: watchlist,
          record: record({
            watchlist: { status: 'done', at: 1, source: 'action' },
          }),
          counts: { watchlist: 0 },
        }),
    ).toBe('done');
  });

  it('should be skipped when stored as skipped', () => {
    expect(
      watchlist &&
        resolveStep({
          step: watchlist,
          record: record({ watchlist: { status: 'skipped', at: 1 } }),
          counts: {},
        }),
    ).toBe('skipped');
  });

  it('should prefer done over a skip once the signal lands', () => {
    expect(
      watchlist &&
        resolveStep({
          step: watchlist,
          record: record({ watchlist: { status: 'skipped', at: 1 } }),
          counts: { watchlist: 2 },
        }),
    ).toBe('done');
  });

  it('should wait for the threshold a step asks for', () => {
    const [binge] = buildOnboardingSet({
      steps: [
        {
          id: 'binge',
          completesWith: {
            signal: 'plays',
            mutations: ['history:add'],
            atLeast: 3,
          },
        },
      ],
    }).steps;

    expect(
      binge && resolveStep({ step: binge, record: null, counts: { plays: 2 } }),
    ).toBe('todo');
    expect(
      binge && resolveStep({ step: binge, record: null, counts: { plays: 3 } }),
    ).toBe('done');
  });
});
