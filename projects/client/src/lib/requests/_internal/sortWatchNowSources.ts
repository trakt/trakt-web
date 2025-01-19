import type { WatchNowServiceResponse } from '@trakt/api';

// This list matches the heuristic used in the tvOS app
const MOST_POPULAR_SOURCES: string[] = [
  'netflix',
  'apple_tv_plus',
  'disney_plus',
  'amazon_prime_video',
  'max',
  'apple_tv',
] as const;

function getServiceIndex(source: string): number {
  const index = MOST_POPULAR_SOURCES.indexOf(source);
  return index === -1 ? MOST_POPULAR_SOURCES.length : index;
}

export function sortWatchNowSources(sources: WatchNowServiceResponse[]) {
  return sources
    .toSorted((a, b) => a.source.localeCompare(b.source))
    .toSorted((a, b) => getServiceIndex(a.source) - getServiceIndex(b.source));
}
