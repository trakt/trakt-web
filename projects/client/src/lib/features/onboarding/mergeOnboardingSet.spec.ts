import { describe, expect, it } from 'vitest';
import type { OnboardingSetRecord } from '$lib/features/onboarding/models/OnboardingSetRecord.ts';
import { mergeOnboardingSet } from './mergeOnboardingSet.ts';

function record(
  overrides: Partial<OnboardingSetRecord> = {},
): OnboardingSetRecord {
  return { startedAt: 100, steps: {}, ...overrides };
}

describe('util: mergeOnboardingSet', () => {
  it('should keep the steps each device stored', () => {
    const merged = mergeOnboardingSet(
      record({ steps: { rate: { status: 'done', at: 5, source: 'action' } } }),
      record({ steps: { follow: { status: 'skipped', at: 6 } } }),
    );

    expect(Object.keys(merged.steps).sort()).toEqual(['follow', 'rate']);
  });

  it('should let done win over a newer skip or undo', () => {
    const merged = mergeOnboardingSet(
      record({ steps: { rate: { status: 'done', at: 5, source: 'account' } } }),
      record({ steps: { rate: { status: 'todo', at: 9 } } }),
    );

    expect(merged.steps.rate?.status).toBe('done');
  });

  it('should take the newest of two open states', () => {
    const merged = mergeOnboardingSet(
      record({ steps: { rate: { status: 'skipped', at: 5 } } }),
      record({ steps: { rate: { status: 'todo', at: 9 } } }),
    );

    expect(merged.steps.rate).toEqual({ status: 'todo', at: 9 });
  });

  it('should keep the earliest start, completion and retirement', () => {
    const merged = mergeOnboardingSet(
      record({ startedAt: 100, completedAt: 400 }),
      record({ startedAt: 50, completedAt: 300, retiredAt: 700 }),
    );

    expect(merged.startedAt).toBe(50);
    expect(merged.completedAt).toBe(300);
    expect(merged.retiredAt).toBe(700);
  });

  it('should keep the most recently tracked step', () => {
    const merged = mergeOnboardingSet(
      record({ tracked: { stepId: 'rate', at: 10 } }),
      record({ tracked: { stepId: null, at: 20 } }),
    );

    expect(merged.tracked).toEqual({ stepId: null, at: 20 });
  });
});
