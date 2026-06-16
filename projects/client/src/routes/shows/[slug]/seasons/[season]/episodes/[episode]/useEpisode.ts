import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { EMPTY_CREW } from '$lib/requests/_internal/mapToMediaCrew.ts';
import { episodeIntlQuery } from '$lib/requests/queries/episode/episodeIntlQuery.ts';
import { episodePeopleQuery } from '$lib/requests/queries/episode/episodePeopleQuery.ts';
import { episodeSummaryQuery } from '$lib/requests/queries/episode/episodeSummaryQuery.ts';
import { streamEpisodeQuery } from '$lib/requests/queries/episode/streamEpisodeQuery.ts';
import { showIntlQuery } from '$lib/requests/queries/shows/showIntlQuery.ts';
import { showSeasonsQuery } from '$lib/requests/queries/shows/showSeasonsQuery.ts';
import { showSummaryQuery } from '$lib/requests/queries/shows/showSummaryQuery.ts';
import { findPreferredStreamingService } from '$lib/stores/_internal/findPreferredStreamingService.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import { findRegionalIntl } from '$lib/utils/media/findRegionalIntl.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { combineLatest, type Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type UseEpisodeParams = {
  slug: string;
  season: number;
  episode: number;
};

export function useEpisode(params$: Observable<UseEpisodeParams>) {
  const { country, favorites } = useStreamingPreferences();

  const episode = useQuery(
    params$.pipe(map((p) => episodeSummaryQuery(p))),
  );
  const show = useQuery(
    params$.pipe(map((p) => showSummaryQuery({ slug: p.slug }))),
  );
  const seasons = useQuery(
    params$.pipe(map((p) => showSeasonsQuery(p))),
  );
  const crew = useQuery(
    params$.pipe(map((p) => episodePeopleQuery(p))),
  );

  const locale = languageTag();
  const isLocaleSkipped = locale === 'en';
  const { language } = getLanguageAndRegion();

  const intl = useQuery(
    params$.pipe(
      map((p) =>
        episodeIntlQuery({ ...p, language, enabled: !isLocaleSkipped })
      ),
    ),
  );
  const showIntl = useQuery(
    params$.pipe(
      map((p) =>
        showIntlQuery({ slug: p.slug, language, enabled: !isLocaleSkipped })
      ),
    ),
  );

  const streamOnQuery = useQuery(
    combineLatest([params$, country]).pipe(
      map(([p, country]) => streamEpisodeQuery({ ...p, country })),
    ),
  );

  const queries = [
    episode,
    show,
    seasons,
    intl,
    showIntl,
    crew,
  ];

  const coreQueries = [episode, show];

  // Keep isLoading true until episode + show payloads are present -
  // queries can flip to !fetching while `data` is still undefined
  // (errored or empty), which would otherwise let the page render
  // a half-populated summary.
  const isLoading = combineLatest([
    combineLatest(queries),
    combineLatest(coreQueries),
  ]).pipe(
    map(([$queries, $coreQueries]) =>
      $queries.some(toLoadingState) ||
      $coreQueries.some(($query) => $query.data == null)
    ),
  );

  return {
    isLoading,
    episode: episode.pipe(map(($episode) => $episode.data)),
    show: show.pipe(map(($show) => $show.data)),
    seasons: seasons.pipe(map(($seasons) => $seasons.data)),
    crew: crew.pipe(map(($crew) => $crew.data ?? EMPTY_CREW)),
    intl: combineLatest([intl, episode]).pipe(
      map(([$intl, $episode]) =>
        findRegionalIntl({
          type: 'episode',
          translations: $intl.data,
          fallback: $episode.data,
        })
      ),
    ),
    showIntl: combineLatest([showIntl, show]).pipe(
      map(([$showIntl, $show]) =>
        findRegionalIntl({
          type: 'show',
          translations: $showIntl.data,
          fallback: $show.data,
        })
      ),
    ),
    // FIXME: move these to the 'where to watch' component
    streamOn: combineLatest([streamOnQuery, favorites, country]).pipe(
      map(([$streamOn, $favorites, $country]) => {
        if (!$streamOn.data) {
          return;
        }

        return {
          services: $streamOn.data,
          preferred: findPreferredStreamingService({
            services: $streamOn.data,
            favorites: $favorites,
            countryCode: $country,
          }),
        };
      }),
    ),
  };
}
