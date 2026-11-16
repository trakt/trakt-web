import { describe, expect, it } from 'vitest';
import type { OnboardingSetRecord } from '$lib/features/onboarding/models/OnboardingSetRecord.ts';
import { applyRecordChange } from './applyRecordChange.ts';

const NOW = 500;
const STARTED: OnboardingSetRecord = { startedAt: 100, steps: {} };

describe('util: applyRecordChange', () => {
  it('should start a set that has no record yet', () => {
    expect(
      applyRecordChange({ record: null, change: { type: 'start' }, now: NOW }),
    ).toEqual({ startedAt: NOW, steps: {} });
  });

  it('should never restart a set', () => {
    expect(
      applyRecordChange({
        record: STARTED,
        change: { type: 'start' },
        now: NOW,
      }),
    ).toBeNull();
  });

  it('should ignore changes to a set that never started', () => {
    expect(
      applyRecordChange({
        record: null,
        change: { type: 'done', stepId: 'rate', source: 'action' },
        now: NOW,
      }),
    ).toBeNull();
  });

  it('should store a done step with its source and time', () => {
    expect(
      applyRecordChange({
        record: STARTED,
        change: { type: 'done', stepId: 'rate', source: 'action' },
        now: NOW,
      })?.steps.rate,
    ).toEqual({ status: 'done', at: NOW, source: 'action' });
  });

  it('should keep the first source once a step is done', () => {
    const record = {
      ...STARTED,
      steps: {
        rate: { status: 'done' as const, at: 1, source: 'account' as const },
      },
    };

    expect(
      applyRecordChange({
        record,
        change: { type: 'done', stepId: 'rate', source: 'action' },
        now: NOW,
      }),
    ).toBeNull();
  });

  it('should skip and undo a step, reopening a completed set', () => {
    const skipped = applyRecordChange({
      record: { ...STARTED, completedAt: 300 },
      change: { type: 'skip', stepId: 'rate' },
      now: NOW,
    });
    const undone = applyRecordChange({
      record: skipped,
      change: { type: 'unskip', stepId: 'rate' },
      now: NOW + 1,
    });

    expect(skipped?.steps.rate).toEqual({ status: 'skipped', at: NOW });
    expect(undone?.steps.rate).toEqual({ status: 'todo', at: NOW + 1 });
    expect(undone?.completedAt).toBeNull();
  });

  it('should skip a step again after an undo', () => {
    expect(
      applyRecordChange({
        record: {
          ...STARTED,
          steps: { rate: { status: 'todo', at: 1 } },
        },
        change: { type: 'skip', stepId: 'rate' },
        now: NOW,
      })?.steps.rate?.status,
    ).toBe('skipped');
  });

  it('should track and untrack a step with a timestamp', () => {
    const tracked = applyRecordChange({
      record: STARTED,
      change: { type: 'track', stepId: 'rate' },
      now: NOW,
    });
    const untracked = applyRecordChange({
      record: tracked,
      change: { type: 'track', stepId: null },
      now: NOW + 1,
    });

    expect(tracked?.tracked).toEqual({ stepId: 'rate', at: NOW });
    expect(untracked?.tracked).toEqual({ stepId: null, at: NOW + 1 });
  });

  it('should complete and retire only once', () => {
    const completed = { ...STARTED, completedAt: 1, retiredAt: 2 };

    expect(
      applyRecordChange({
        record: completed,
        change: { type: 'complete' },
        now: NOW,
      }),
    ).toBeNull();
    expect(
      applyRecordChange({
        record: completed,
        change: { type: 'retire' },
        now: NOW,
      }),
    ).toBeNull();
  });
});
