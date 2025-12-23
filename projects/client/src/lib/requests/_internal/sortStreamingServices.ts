import type { WatchNowServiceResponse } from '@trakt/api';

// This list matches the heuristic used in the android TV app
const MOST_POPULAR_SOURCES: string[] = [
  'netflix',
  'netflix_standard_with_ads',
  'apple_tv_plus',
  'apple_tv',
  'disney_plus',
  'amazon_prime_video',
  'amazon_prime_video_free_with_ads',
  'hbo_max',
  'hbo_max_amazon_channel',
  'hulu',
] as const;

function getServiceIndex(source: string): number {
  const index = MOST_POPULAR_SOURCES.indexOf(source);
  return index === -1 ? MOST_POPULAR_SOURCES.length : index;
}

export function sortStreamingServices(sources: WatchNowServiceResponse[]) {
  return sources
    .toSorted((a, b) => a.source.localeCompare(b.source))
    .toSorted((a, b) => getServiceIndex(a.source) - getServiceIndex(b.source));
}
