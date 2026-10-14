import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject } from 'rxjs';
import type { NextStepId } from '../NextStepId.ts';
import {
  type NextStepsPreferences,
  NextStepsPreferencesSchema,
} from '../NextStepsPreferences.ts';

const STORAGE_KEY = 'trakt-next-steps';
const TRACKING_ID = 'next-steps';
const DEFAULT_PREFERENCES: NextStepsPreferences = {
  isDismissed: false,
  skipped: [],
};

function readPreferences(): NextStepsPreferences {
  try {
    const parsed = NextStepsPreferencesSchema.safeParse(
      JSON.parse(safeLocalStorage.getItem(STORAGE_KEY) ?? 'null'),
    );
    return parsed.success ? parsed.data : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

// Module scoped so the Home card and the drawer share one value: a change in
// the drawer must reach the card without a reload.
const preferences = new BehaviorSubject<NextStepsPreferences>(
  readPreferences(),
);

function save(next: NextStepsPreferences) {
  safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  preferences.next(next);
}

export function useNextStepsPreferences() {
  const { track } = useTrack(AnalyticsEvent.BannerDismiss);

  const dismiss = () => {
    save({ ...preferences.value, isDismissed: true });
    track({ id: TRACKING_ID, value: 'dismiss' });
  };

  const skip = (id: NextStepId) => {
    const { skipped } = preferences.value;
    if (skipped.includes(id)) return;

    save({ ...preferences.value, skipped: [...skipped, id] });
    track({ id: TRACKING_ID, value: `skip:${id}` });
  };

  const unskip = (id: NextStepId) => {
    const { skipped } = preferences.value;
    save({
      ...preferences.value,
      skipped: skipped.filter((skippedId) => skippedId !== id),
    });
  };

  return {
    preferences: preferences.asObservable(),
    dismiss,
    skip,
    unskip,
  };
}
