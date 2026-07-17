import { useQuery } from '$lib/features/query/useQuery.ts';
import { showSeasonEpisodesQuery } from '$lib/requests/queries/shows/showSeasonEpisodesQuery.ts';
import { hasAired } from '$lib/utils/media/hasAired.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import type { EpisodeSummaryParams } from './useEpisodeSummary.ts';

export function useEpisodeAired(params$: Observable<EpisodeSummaryParams>) {
  const query = useQuery(
    params$.pipe(
      map(({ slug, season }) => showSeasonEpisodesQuery({ slug, season })),
    ),
  );

  return {
    isAired: combineLatest([query, params$]).pipe(
      map(([$query, { episode }]) => {
        const entry = $query.data?.find(({ number }) => number === episode);

        if (!entry) {
          return undefined;
        }

        return hasAired(entry);
      }),
    ),
  };
}
