import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';

const MARKER_STORAGE_KEY = 'trakt-marker';

function loadMarkerFromStorage(): Nil | number {
  const stored = safeLocalStorage.getItem(MARKER_STORAGE_KEY);

  if (stored) {
    const parsed = parseInt(stored, 10);
    return isNaN(parsed) ? null : parsed;
  }

  return null;
}

function saveMarkerToStorage(marker: Nil | string | number): void {
  if (marker != null) {
    safeLocalStorage.setItem(MARKER_STORAGE_KEY, marker.toString());
  }
}

const state = {
  marker: loadMarkerFromStorage() ?? Date.now(),
} as { marker: Nil | string | number };

export const setMarker = () => {
  state.marker = Date.now();
  saveMarkerToStorage(state.marker);
};

export const getMarker = () => {
  return state.marker;
};
