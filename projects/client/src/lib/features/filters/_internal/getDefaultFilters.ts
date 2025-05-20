import { getDeviceType } from '$lib/utils/devices/getDeviceType.ts';
import { STORED_FILTERS_KEY } from '../useStoredFilters.ts';
import { DEFAULT_FILTERS } from './constants.ts';

export function getDefaultFilters() {
  const savedFilters = localStorage.getItem(STORED_FILTERS_KEY);
  if (savedFilters) {
    return JSON.parse(savedFilters);
  }

  const isTV = getDeviceType(globalThis.navigator.userAgent) === 'tv';
  if (isTV) {
    return DEFAULT_FILTERS;
  }
}
