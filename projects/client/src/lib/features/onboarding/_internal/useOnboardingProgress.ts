import { ClientStateKey } from '$lib/features/client-state/models/ClientStateKey.ts';
import { useClientRecord } from '$lib/features/client-state/useClientRecord.ts';
import type { OnboardingRecordChange } from '$lib/features/onboarding/models/OnboardingRecordChange.ts';
import type { OnboardingSetRecord } from '$lib/features/onboarding/models/OnboardingSetRecord.ts';
import { applyRecordChange } from './applyRecordChange.ts';

export function useOnboardingProgress() {
  const store = useClientRecord(ClientStateKey.Onboarding);

  return {
    records: store.entries,
    apply: (
      setId: string,
      change: OnboardingRecordChange,
    ): OnboardingSetRecord | null => {
      const next = applyRecordChange({
        record: store.current(setId) ?? null,
        change,
        now: Date.now(),
      });
      if (!next) return null;

      store.set(setId, next);
      return next;
    },
    reset: (setIds: ReadonlyArray<string>) => setIds.forEach(store.remove),
  };
}
