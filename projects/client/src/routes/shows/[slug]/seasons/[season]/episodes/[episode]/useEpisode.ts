import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
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
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

type UseEpisodeParams = {
  slug: string;
  season: number;
  episode: number;
};

export function useEpisode(
  params: UseEpisodeParams,
) {
  const { country, favorites } = useStreamingPreferences();

  const episode = useQuery(episodeSummaryQuery(params));
  const show = useQuery(showSummaryQuery({ slug: params.slug }));
  const seasons = useQuery(showSeasonsQuery(params));
  const crew = useQuery(episodePeopleQuery(params));

  const locale = languageTag();
  const isLocaleSkipped = locale === 'en';
  const { language } = getLanguageAndRegion();

  const intl = useQuery(
    episodeIntlQuery({ ...params, language, enabled: !isLocaleSkipped }),
  );
  const showIntl = useQuery(
    showIntlQuery({ slug: params.slug, language, enabled: !isLocaleSkipped }),
  );

  const streamOnQuery = country
    .pipe(
      switchMap((country) =>
        useQuery(streamEpisodeQuery({ ...params, country }))
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

  const isLoading = combineLatest(queries).pipe(
    map(($queries) => $queries.some(toLoadingState)),
  );

  return {
    isLoading,
    episode: episode.pipe(map(($episode) => $episode.data)),
    show: show.pipe(map(($show) => $show.data)),
    seasons: combineLatest([seasons, episode]).pipe(
      map(([$seasons, $episode]) =>
        $seasons.data?.filter((season) =>
          season.number === $episode.data?.season
        )
      ),
    ),
    crew: crew.pipe(map(($crew) => $crew.data)),
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
