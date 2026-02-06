import { getDayKey } from '$lib/utils/date/getDayKey.ts';

export const DATE_KEY_PREFIX = 'day-';

export function dateKey(date: Date) {
  return `${DATE_KEY_PREFIX}${getDayKey(date)}`;
}
