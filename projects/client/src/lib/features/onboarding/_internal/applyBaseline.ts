import type { OnboardingSignalCounts } from '$lib/features/onboarding/models/OnboardingSignalCounts.ts';

type ApplyBaselineParams = {
  counts: OnboardingSignalCounts;
  baseline: OnboardingSignalCounts | Nil;
};

export function applyBaseline({
  counts,
  baseline,
}: ApplyBaselineParams): OnboardingSignalCounts {
  if (!baseline) return counts;

  const base: Readonly<Record<string, number | undefined>> = baseline;

  return Object.fromEntries(
    Object.entries(counts).map(([signal, count]) => [
      signal,
      Math.max(0, (count ?? 0) - (base[signal] ?? 0)),
    ]),
  );
}
