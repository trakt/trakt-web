import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject } from 'rxjs';
import type { ActivityHistory } from '../../requests/queries/users/activityHistoryQuery.ts';
import type { DismissedItem } from './models/DismissedItem.ts';

const STORAGE_KEY = 'rate_now_toast_dismissed';

function getStoredDismissal(): DismissedItem | null {
  const item = safeLocalStorage.getItem(STORAGE_KEY);
  if (!item) {
    return null;
  }

  try {
    return JSON.parse(item) as DismissedItem;
  } catch {
    return null;
  }
}

const createDismissalStore = () => {
  const latest = new BehaviorSubject<DismissedItem | null>(
    getStoredDismissal(),
  );

  return {
    latest,
    dismiss: (id: number, type: ExtendedMediaType) => {
      const dismissal: DismissedItem = {
        id,
        type,
        dismissedAt: Date.now(),
      };

      safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(dismissal));
      latest.next(dismissal);
    },
  };
};

const dismissalStore = createDismissalStore();

export function useDismissals() {
  return {
    latest: dismissalStore.latest,
    dismiss: dismissalStore.dismiss,
    wasDismissed: (
      activity: ActivityHistory,
      dismissedItem: DismissedItem | Nil,
    ) => {
      if (!dismissedItem || activity.type !== dismissedItem.type) {
        return false;
      }

      return activity.type === 'episode'
        ? activity.episode.id === dismissedItem.id
        : activity.movie.id === dismissedItem.id;
    },
  };
}
