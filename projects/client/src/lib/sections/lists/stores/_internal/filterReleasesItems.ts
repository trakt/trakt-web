import type { ReleasesCalendarEntry } from '$lib/requests/queries/calendars/releasesCalendarQuery.ts';
import type { UpcomingEpisodeEntry } from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';

type FilterReleasesItemsParams = {
  entries: readonly ReleasesCalendarEntry[];
  limit: number;
  now: Date;
};

function isUpcomingEpisodeEntry(
  entry: ReleasesCalendarEntry,
): entry is UpcomingEpisodeEntry {
  return 'show' in entry;
}

export function filterReleasesItems({
  entries,
  limit,
  now,
}: FilterReleasesItemsParams): ReleasesCalendarEntry[] {
  if (limit <= 0) {
    return [];
  }

  const seenShowIds = new Set<number>();
  const nowTime = now.getTime();

  return entries
    .filter((entry) => entry.effectiveReleaseDate.getTime() > nowTime)
    .toSorted((a, b) =>
      a.effectiveReleaseDate.getTime() - b.effectiveReleaseDate.getTime()
    )
    .filter((entry) => {
      if (!isUpcomingEpisodeEntry(entry)) {
        return true;
      }

      const showId = entry.show.id;

      if (seenShowIds.has(showId)) {
        return false;
      }

      seenShowIds.add(showId);
      return true;
    })
    .slice(0, limit);
}
