import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';
import type { OnboardingRetireContext } from '$lib/features/onboarding/models/OnboardingRetireContext.ts';
import type { OnboardingSelection } from '$lib/features/onboarding/models/OnboardingSelection.ts';
import type { OnboardingSet } from '$lib/features/onboarding/models/OnboardingSet.ts';
import type { OnboardingSetProgress } from '$lib/features/onboarding/models/OnboardingSetProgress.ts';
import type { OnboardingSetRecord } from '$lib/features/onboarding/models/OnboardingSetRecord.ts';
import type { OnboardingSignalCounts } from '$lib/features/onboarding/models/OnboardingSignalCounts.ts';
import { isSetFolded } from './isSetFolded.ts';
import { resolveSet } from './resolveSet.ts';

type OnboardingRecords = Readonly<
  Record<string, OnboardingSetRecord | undefined>
>;

type SelectActiveSetParams = {
  catalog: ReadonlyArray<OnboardingSet>;
  records: OnboardingRecords;
  counts: OnboardingSignalCounts;
  user: UserSettings;
  now: number;
  loadedAt: number;
  dismissedSetId: string | null;
  bypassesEligibility: boolean;
};

function isClosed(record: OnboardingSetRecord | Nil): boolean {
  return record?.completedAt != null || record?.retiredAt != null;
}

type SetEvaluation = {
  progress: OnboardingSetProgress;
  isRetiring: boolean;
  isShown: boolean;
  isSettled: boolean;
};

function isUnlocked(
  set: OnboardingSet,
  evaluated: ReadonlyArray<SetEvaluation>,
): boolean {
  if (!set.unlocksAfter) return true;

  const prerequisite = evaluated.find(
    ({ progress }) => progress.set.id === set.unlocksAfter,
  );
  return prerequisite?.isSettled ?? false;
}

function toRetireContext({
  set,
  record,
  counts,
}: {
  set: OnboardingSet;
  record: OnboardingSetRecord | null;
  counts: OnboardingSignalCounts;
}): OnboardingRetireContext {
  const signalOf = (stepId: string) => {
    const completion = set.steps.find(
      (step) => step.id === stepId,
    )?.completesWith;
    if (!completion || completion === 'always') return null;
    return completion.signal;
  };

  return {
    count: (stepId) => {
      const signal = signalOf(stepId);
      return signal ? (counts[signal] ?? 0) : 0;
    },
    isDoneByAction: (stepId) => record?.steps[stepId]?.source === 'action',
  };
}

export function selectActiveSet({
  catalog,
  records,
  counts,
  user,
  now,
  loadedAt,
  dismissedSetId,
  bypassesEligibility,
}: SelectActiveSetParams): OnboardingSelection {
  const evaluate = (set: OnboardingSet): SetEvaluation => {
    const record = records[set.id] ?? null;
    const hitsRetireRule = set.retireWhen(
      toRetireContext({ set, record, counts }),
    );
    const isRetired = record?.retiredAt != null || hitsRetireRule;
    const isEligible = set.eligibleWhen({
      user,
      startedAt: record?.startedAt,
      now,
    });
    const isHidden =
      isSetFolded({ record, loadedAt }) || dismissedSetId === set.id;
    const isShown =
      !isHidden && (bypassesEligibility || (isEligible && !isRetired));

    return {
      progress: resolveSet({ set, record, counts }),
      isRetiring: hitsRetireRule && record != null && record.retiredAt == null,
      isShown,
      isSettled: !isShown || isClosed(record),
    };
  };

  const evaluated = catalog.reduce<ReadonlyArray<SetEvaluation>>(
    (earlier, set) =>
      isUnlocked(set, earlier) ? [...earlier, evaluate(set)] : earlier,
    [],
  );

  return {
    active: evaluated.find(({ isShown }) => isShown)?.progress ?? null,
    retiring: evaluated
      .filter(({ isRetiring }) => isRetiring)
      .map(({ progress }) => progress.set.id),
  };
}
