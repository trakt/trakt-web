import type { YirDetail } from '$lib/requests/models/YirDetail.ts';

export function reelPosters(
  detail: YirDetail | null,
): ReadonlyArray<string | null> {
  const urls = detail
    ? [...detail.mostWatched.shows, ...detail.mostWatched.movies]
      .sort((a, b) => b.plays - a.plays)
      .map((item) => item.entry.poster.url.medium)
    : [];

  return Array.from({ length: 9 }, (_, index) => urls.at(index) ?? null);
}
