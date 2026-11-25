import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { z } from 'zod';
import type { UserId } from '$lib/features/client-state/models/UserId.ts';
import type { OnboardingSignalCounts } from '$lib/features/onboarding/models/OnboardingSignalCounts.ts';

const LOCAL_STORAGE_KEY = 'trakt-onboarding-baseline';

const BaselinesSchema = z.record(z.string(), z.record(z.string(), z.number()));

type Baselines = Readonly<Record<string, OnboardingSignalCounts>>;

function readBaselines(): Baselines {
  const raw = safeLocalStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = BaselinesSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : {};
  } catch {
    return {};
  }
}

const baselines$ = new BehaviorSubject<Baselines>(readBaselines());

export const onboardingBaselineStore = {
  baseline: (userId: UserId) =>
    baselines$.pipe(
      map(($baselines) => $baselines[String(userId)] ?? null),
      distinctUntilChanged(),
    ),
  set: (userId: UserId, counts: OnboardingSignalCounts) => {
    const next = { ...baselines$.value, [String(userId)]: counts };
    safeLocalStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
    baselines$.next(next);
  },
};
