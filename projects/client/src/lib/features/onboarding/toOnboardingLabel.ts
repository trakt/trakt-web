import { m } from '$lib/features/i18n/messages.ts';
import type { OnboardingSetProgress } from '$lib/features/onboarding/models/OnboardingSetProgress.ts';

export function toOnboardingLabel(
  progress: Pick<OnboardingSetProgress, 'done' | 'total'> | null,
) {
  if (!progress) return m.button_label_onboarding();

  const count = m.onboarding_progress_count({
    done: progress.done,
    total: progress.total,
  });
  return `${m.button_label_onboarding()} · ${count}`;
}
