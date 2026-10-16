import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject, map } from 'rxjs';

const LOCAL_STORAGE_KEY = 'trakt-dismissed-banners';

type DismissalMap = Record<string, string>;

function getDismissedBanners(): DismissalMap {
  const stored = safeLocalStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    return {};
  }

  try {
    return JSON.parse(stored) as DismissalMap;
  } catch {
    return {};
  }
}

function saveDismissedBanners(dismissals: DismissalMap) {
  safeLocalStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify(dismissals),
  );
}

export function useBannerDismissal(id: string, value: string) {
  const dismissed = new BehaviorSubject(getDismissedBanners());
  const { track } = useTrack(AnalyticsEvent.BannerDismiss);

  const dismiss = () => {
    const current = dismissed.value;
    current[id] = value;
    saveDismissedBanners(current);
    track({ id, value });
    dismissed.next(current);
  };

  return {
    dismiss,
    isDismissed: dismissed.pipe(map(($dismissed) => $dismissed[id] === value)),
  };
}
