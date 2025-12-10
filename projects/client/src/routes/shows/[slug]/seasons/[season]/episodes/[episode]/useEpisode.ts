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
import { toObservable } from '$lib/utils/store/toObservable.ts';
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

  const streamOn = toObservable(country)
    .pipe(
      switchMap((c) =>
        toObservable(useQuery(streamEpisodeQuery({ ...params, country: c })))
      ),
    );

  const queries = [
    toObservable(episode),
    toObservable(show),
    toObservable(seasons),
    toObservable(intl),
    toObservable(showIntl),
    toObservable(crew),
  ];

  const isLoading = combineLatest(queries).pipe(
    map((qs) => qs.some(toLoadingState)),
  );

  return {
    isLoading,
    episode: toObservable(episode).pipe(map((e) => e.data)),
    show: toObservable(show).pipe(map((s) => s.data)),
    seasons: combineLatest([toObservable(seasons), toObservable(episode)]).pipe(
      map(([s, e]) =>
        s.data?.filter((season) => season.number === e.data?.season)
      ),
    ),
    crew: toObservable(crew).pipe(map((c) => c.data)),
    intl: combineLatest([toObservable(intl), toObservable(episode)]).pipe(
      map(([i, e]) =>
        findRegionalIntl({
          type: 'episode',
          translations: i.data,
          fallback: e.data,
        })
      ),
    ),
    showIntl: combineLatest([toObservable(showIntl), toObservable(show)]).pipe(
      map(([i, s]) =>
        findRegionalIntl({
          type: 'show',
          translations: i.data,
          fallback: s.data,
        })
      ),
    ),
    // FIXME: move these to the 'where to watch' component
    streamOn: combineLatest([streamOn, favorites, country]).pipe(
      map(([streamOnResponse, favs, countryCode]) => {
        if (!streamOnResponse.data) {
          return;
        }

        return {
          services: streamOnResponse.data,
          preferred: findPreferredStreamingService({
            services: streamOnResponse.data,
            favorites: favs,
            countryCode,
          }),
        };
      }),
    ),
  };
}
