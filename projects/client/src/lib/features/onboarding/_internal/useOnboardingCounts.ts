import { combineLatest, map, type Observable, of, switchMap } from 'rxjs';
import type { UserId } from '$lib/features/client-state/models/UserId.ts';
import type { OnboardingSet } from '$lib/features/onboarding/models/OnboardingSet.ts';
import type { OnboardingSignalCounts } from '$lib/features/onboarding/models/OnboardingSignalCounts.ts';
import type { OnboardingSignalId } from '$lib/features/onboarding/models/OnboardingSignalId.ts';
import { applyBaseline } from './applyBaseline.ts';
import { onboardingBaselineStore } from './onboardingBaselineStore.ts';
import { onboardingSignals } from './onboardingSignals.ts';

type UseOnboardingCountsParams = {
  catalog: ReadonlyArray<OnboardingSet>;
  userId: Observable<UserId>;
};

function toSignalIds(
  catalog: ReadonlyArray<OnboardingSet>,
): ReadonlyArray<OnboardingSignalId> {
  const ids = catalog.flatMap((set) =>
    set.steps.flatMap(({ completesWith }) =>
      completesWith === 'always' ? [] : [completesWith.signal],
    ),
  );
  return Array.from(new Set(ids));
}

export function useOnboardingCounts({
  catalog,
  userId,
}: UseOnboardingCountsParams) {
  const signalIds = toSignalIds(catalog);

  const raw: Observable<OnboardingSignalCounts> =
    signalIds.length === 0
      ? of({})
      : combineLatest(
          Object.fromEntries(
            signalIds.map((signal) => [signal, onboardingSignals[signal]()]),
          ),
        );

  const counts = userId.pipe(
    switchMap(($userId) =>
      combineLatest([raw, onboardingBaselineStore.baseline($userId)]),
    ),
    map(([$counts, baseline]) => applyBaseline({ counts: $counts, baseline })),
  );

  return { raw, counts };
}
