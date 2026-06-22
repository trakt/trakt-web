/**
 * Younify connection ids live in a different namespace than the watch-now
 * streaming sources that own the colorized logos (built-in SVG components plus
 * brand-colored catalog images). Map the divergent ids onto their watch-now
 * source slug so the sync surfaces can reuse those logos; ids that already
 * match the watch-now slug pass through unchanged.
 */
const YOUNIFY_TO_WATCH_NOW: Readonly<Record<string, string>> = {
  amazon: 'amazon_prime_video',
  hbomax: 'max',
  appletv: 'apple_tv',
  disneyplus: 'disney_plus',
  vudu: 'fandango',
  paramountplus: 'paramount_plus',
};

export function toWatchNowSource(serviceId: string): string {
  return YOUNIFY_TO_WATCH_NOW[serviceId] ?? serviceId;
}
