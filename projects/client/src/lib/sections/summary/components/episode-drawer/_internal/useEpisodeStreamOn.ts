import { useQuery } from '$lib/features/query/useQuery.ts';
import type { StreamOn } from '$lib/requests/models/StreamOn.ts';
import { streamEpisodeQuery } from '$lib/requests/queries/episode/streamEpisodeQuery.ts';
import { findPreferredStreamingService } from '$lib/stores/_internal/findPreferredStreamingService.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import type { EpisodeSummaryParams } from './useEpisodeSummary.ts';

export function useEpisodeStreamOn(params$: Observable<EpisodeSummaryParams>) {
  const { country, favorites } = useStreamingPreferences();

  const query = useQuery(
    combineLatest([params$, country]).pipe(
      map(([params, country]) => streamEpisodeQuery({ ...params, country })),
    ),
  );

  return {
    streamOn: combineLatest([query, favorites, country]).pipe(
      map(([$query, $favorites, $country]): StreamOn | undefined => {
        if (!$query.data) {
          return;
        }

        return {
          services: $query.data,
          preferred: findPreferredStreamingService({
            services: $query.data,
            favorites: $favorites,
            countryCode: $country,
          }),
        };
      }),
    ),
  };
}
