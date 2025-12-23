import { safeLocalStorage } from '../../../utils/storage/safeStorage.ts';
import { DISMISSAL_STORAGE_KEY } from '../constants/index.ts';
import type {
  StoredDismissalsV1,
  StoredDismissalsV2,
} from '../models/StoredDismissal.ts';
import { normalizeDismissalItems } from './normalizeDismissalItems.ts';

const EMPTY_DATA: StoredDismissalsV2 = {
  version: 2,
  items: [],
  dismissalCount: 0,
  isSuppressed: false,
};

// FIXME: remove backwards compatibility end of jan 2026
function getStoreVersion(value: unknown): number | Nil {
  if (!value || typeof value !== 'object') return null;

  if ('version' in value && typeof value.version === 'number') {
    return value.version;
  }

  return 1;
}

function parseStoredDismissals(raw: string | Nil): StoredDismissalsV2 | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    const version = getStoreVersion(parsed);
    if (!version) {
      return null;
    }

    switch (version) {
      case 2: {
        const data = parsed as StoredDismissalsV2;
        const normalized = normalizeDismissalItems(data.items);

        return {
          ...data,
          items: normalized,
        };
      }
      case 1: {
        const data = parsed as StoredDismissalsV1;
        const normalized = normalizeDismissalItems([{
          id: data.id.toString(),
          type: data.type,
          dismissedAt: data.dismissedAt,
        }]);

        return {
          ...EMPTY_DATA,
          dismissalCount: normalized.length,
          items: normalized,
        };
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
}

export function getStoredDismissals(): StoredDismissalsV2 {
  return parseStoredDismissals(
    safeLocalStorage.getItem(DISMISSAL_STORAGE_KEY),
  ) ?? EMPTY_DATA;
}
