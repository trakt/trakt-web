import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject, map } from 'rxjs';
import { isNudgeHidden } from './isNudgeHidden.ts';

const LOCAL_STORAGE_KEY = 'trakt-nudge-hidden-at';
const NUDGE_BANNER_ID = 'vip-nudge';

export function useNudgeDismissal() {
  const hiddenAt = new BehaviorSubject(
    safeLocalStorage.getItem(LOCAL_STORAGE_KEY),
  );
  const { track } = useTrack(AnalyticsEvent.BannerDismiss);

  const hide = () => {
    const now = String(Date.now());

    safeLocalStorage.setItem(LOCAL_STORAGE_KEY, now);
    track({ id: NUDGE_BANNER_ID, value: 'hidden' });
    hiddenAt.next(now);
  };

  return {
    hide,
    isHidden: hiddenAt.pipe(
      map(($hiddenAt) =>
        isNudgeHidden({ hiddenAt: $hiddenAt, now: Date.now() }),
      ),
    ),
  };
}
