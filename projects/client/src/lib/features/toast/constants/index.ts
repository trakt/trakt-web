import { time } from '$lib/utils/timing/time.ts';

export const RECENTLY_WATCHED_WINDOW = time.days(1);
export const DISMISSAL_STORAGE_KEY = 'rate_now_toast_dismissed';
export const DISMISSAL_LIMIT = 10;
