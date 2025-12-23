import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject } from 'rxjs';
import { DISMISSAL_STORAGE_KEY } from '../constants/index.ts';
import type { DismissalVariant } from '../models/DismissalVariant.ts';
import type { DismissedItem } from '../models/DismissedItem.ts';
import type { StoredDismissalsV2 } from '../models/StoredDismissal.ts';
import { getStoredDismissals } from './getStoredDismissals.ts';
import { normalizeDismissalItems } from './normalizeDismissalItems.ts';

function writeStoredDismissals(dismissals: StoredDismissalsV2) {
  safeLocalStorage.setItem(DISMISSAL_STORAGE_KEY, JSON.stringify(dismissals));
}

export function createDismissalStore() {
  const stored = getStoredDismissals();
  writeStoredDismissals(stored);

  const dismissals = new BehaviorSubject<StoredDismissalsV2>(stored);

  const update = (value: StoredDismissalsV2) => {
    writeStoredDismissals(value);
    dismissals.next(value);
  };

  return {
    dismissals,
    suppress: () => {
      update({
        ...dismissals.value,
        isSuppressed: true,
      });
    },
    dismiss: (
      id: number,
      type: ExtendedMediaType,
      variant: DismissalVariant,
    ) => {
      const dismissal: DismissedItem = {
        id: id.toString(),
        type,
        dismissedAt: Date.now(),
      };

      const current = dismissals.value;
      const items = normalizeDismissalItems([dismissal, ...current.items]);
      const count = variant === 'manual' ? ++current.dismissalCount : 0;

      update({
        ...current,
        items,
        dismissalCount: count,
      });
    },
  };
}
