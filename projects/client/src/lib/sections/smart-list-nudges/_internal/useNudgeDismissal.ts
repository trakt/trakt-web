import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject, combineLatest, firstValueFrom, map } from 'rxjs';
import { isNudgeDismissed } from './isNudgeDismissed.ts';
import type { NudgeDismissalRecord } from './NudgeDismissalRecord.ts';

const STORAGE_KEY = 'trakt-dismissed-smart-list-nudges';

type DismissalMap = Record<string, NudgeDismissalRecord>;

type UseNudgeDismissalProps = {
  id: string;
  maxDismissals?: number;
};

function readDismissals(): DismissalMap {
  try {
    const stored = safeLocalStorage.getItem(STORAGE_KEY);

    return stored ? (JSON.parse(stored) ?? {}) : {};
  } catch {
    return {};
  }
}

export function useNudgeDismissal({
  id,
  maxDismissals = Number.POSITIVE_INFINITY,
}: UseNudgeDismissalProps) {
  const dismissals = new BehaviorSubject(readDismissals());
  const { track } = useTrack(AnalyticsEvent.BannerDismiss);
  const { user } = useUser();
  const key = user.pipe(map(($user) => `${$user.id}/${id}`));

  const dismiss = async () => {
    const $key = await firstValueFrom(key);
    const current = dismissals.value;
    const next = {
      ...current,
      [$key]: {
        dismissedAt: Date.now(),
        count: (current[$key]?.count ?? 0) + 1,
      },
    };

    safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    track({ id, value: 'dismissed' });
    dismissals.next(next);
  };

  return {
    dismiss,
    isDismissed: combineLatest([dismissals, key]).pipe(
      map(([$dismissals, $key]) =>
        isNudgeDismissed({
          record: $dismissals[$key],
          now: Date.now(),
          maxDismissals,
        }),
      ),
    ),
  };
}
