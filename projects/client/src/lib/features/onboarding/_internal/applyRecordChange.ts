import type { OnboardingRecordChange } from '$lib/features/onboarding/models/OnboardingRecordChange.ts';
import type { OnboardingSetRecord } from '$lib/features/onboarding/models/OnboardingSetRecord.ts';
import type { OnboardingStepRecord } from '$lib/features/onboarding/models/OnboardingStepRecord.ts';

type ApplyRecordChangeParams = {
  record: OnboardingSetRecord | null;
  change: OnboardingRecordChange;
  now: number;
};

function withStep(
  record: OnboardingSetRecord,
  stepId: string,
  step: OnboardingStepRecord,
): OnboardingSetRecord {
  return { ...record, steps: { ...record.steps, [stepId]: step } };
}

function toAccountSteps(
  stepIds: ReadonlyArray<string>,
  now: number,
): Record<string, OnboardingStepRecord> {
  return Object.fromEntries(
    stepIds.map((stepId) => [
      stepId,
      { status: 'done', at: now, source: 'account' } as const,
    ]),
  );
}

function applyToRecord({
  record,
  change,
  now,
}: ApplyRecordChangeParams & {
  record: OnboardingSetRecord;
}): OnboardingSetRecord | null {
  switch (change.type) {
    case 'start':
      return null;
    case 'done': {
      if (record.steps[change.stepId]?.status === 'done') return null;
      return withStep(record, change.stepId, {
        status: 'done',
        at: now,
        source: change.source,
      });
    }
    case 'skip': {
      const status = record.steps[change.stepId]?.status;
      if (status === 'done' || status === 'skipped') return null;
      return withStep(record, change.stepId, { status: 'skipped', at: now });
    }
    case 'unskip': {
      if (record.steps[change.stepId]?.status !== 'skipped') return null;
      return {
        ...withStep(record, change.stepId, { status: 'todo', at: now }),
        completedAt: null,
      };
    }
    case 'track': {
      if ((record.tracked?.stepId ?? null) === change.stepId) return null;
      return { ...record, tracked: { stepId: change.stepId, at: now } };
    }
    case 'complete':
      if (record.completedAt != null) return null;
      return { ...record, completedAt: now };
    case 'retire':
      if (record.retiredAt != null) return null;
      return { ...record, retiredAt: now };
  }
}

export function applyRecordChange({
  record,
  change,
  now,
}: ApplyRecordChangeParams): OnboardingSetRecord | null {
  if (record) return applyToRecord({ record, change, now });
  if (change.type !== 'start') return null;

  return { startedAt: now, steps: toAccountSteps(change.stepIds, now) };
}
