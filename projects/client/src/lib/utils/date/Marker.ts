import type { InvalidateActionOptions } from '$lib/requests/models/InvalidateAction.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';

const MARKER_STORAGE_KEY = 'trakt-marker';
const DEFAULT_MARKER = Date.now();

const keyForInvalidateAction = (action: InvalidateActionOptions) => {
  return `${MARKER_STORAGE_KEY}:${action}`;
};

export const setMarker = (action: InvalidateActionOptions) => {
  safeLocalStorage.setItem(
    keyForInvalidateAction(action),
    Date.now().toString(),
  );
};

export const getMarker = (action: InvalidateActionOptions) => {
  const stored = safeLocalStorage.getItem(
    keyForInvalidateAction(action),
  );

  if (stored) {
    const parsed = parseInt(stored, 10);
    return isNaN(parsed) ? DEFAULT_MARKER : parsed;
  }

  return DEFAULT_MARKER;
};
