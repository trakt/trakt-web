import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { UpcomingEpisodeEntry } from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
import {
  combineLatest,
  map,
  type Observable,
  type OperatorFunction,
} from 'rxjs';
import { matchesEpisodeTypeFilter } from './matchesEpisodeTypeFilter.ts';
import type { EpisodeTypeFilter } from './models/EpisodeTypeFilter.ts';

export function filterByEpisodeType<
  T extends UpcomingEpisodeEntry | MediaEntry,
>(
  episodeType: Observable<EpisodeTypeFilter>,
): OperatorFunction<T[], T[]> {
  return (source) =>
    combineLatest([source, episodeType]).pipe(
      map(([$items, $episodeType]) =>
        $items.filter((item) => matchesEpisodeTypeFilter(item, $episodeType))
      ),
    );
}
