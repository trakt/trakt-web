import { getMonthKey } from '$lib/utils/date/getMonthKey.ts';
import { safeSessionStorage } from '$lib/utils/storage/safeStorage.ts';

const SHINE_STORAGE_KEY = 'trakt-mir-entry-shine';

/*
  The entry glints once per session, the first time it is on screen for a
  given recap month. Reading and marking happen together so the pill and the
  strip (only one renders per device) cannot both claim the moment.
*/
export function useMonthInReviewShine(month: Date) {
  const key = getMonthKey(month);
  const shouldShine = safeSessionStorage.getItem(SHINE_STORAGE_KEY) !== key;

  if (shouldShine) {
    safeSessionStorage.setItem(SHINE_STORAGE_KEY, key);
  }

  return { shouldShine };
}
