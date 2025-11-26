import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { derived, writable } from 'svelte/store';

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
  const dismissed = writable(getDismissedBanners());
  const { track } = useTrack(AnalyticsEvent.BannerDismiss);

  const dismiss = () => {
    dismissed.update((current) => {
      current[id] = value;
      saveDismissedBanners(current);
      track({ id, value });
      return current;
    });
  };

  return {
    dismiss,
    isDismissed: derived(dismissed, ($dismissed) => $dismissed[id] === value),
  };
}
