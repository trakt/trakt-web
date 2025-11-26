import { derived, writable } from 'svelte/store';
import { safeLocalStorage } from '../../../utils/storage/safeStorage.ts';

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

  const dismiss = () => {
    dismissed.update((current) => {
      current[id] = value;
      saveDismissedBanners(current);
      return current;
    });
  };

  return {
    dismiss,
    isDismissed: derived(dismissed, ($dismissed) => $dismissed[id] === value),
  };
}
