import { time } from '$lib/utils/timing/time.ts';

const MAX_BROWSER_AGE_MS = time.days(7);

const toSeconds = (ms: number) => Math.max(0, Math.floor(ms / time.seconds(1)));

export function shareImageCacheControl(timeToLiveMs: number): string {
  const browserAge = toSeconds(Math.min(timeToLiveMs, MAX_BROWSER_AGE_MS));

  return `public, max-age=${browserAge}, s-maxage=${toSeconds(timeToLiveMs)}`;
}
