import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { showIntlQuery } from '$lib/requests/queries/shows/showIntlQuery.ts';
import { showPeopleQuery } from '$lib/requests/queries/shows/showPeopleQuery.ts';
import { showSeasonsQuery } from '$lib/requests/queries/shows/showSeasonsQuery.ts';
import { showSentimentsQuery } from '$lib/requests/queries/shows/showSentimentsQuery.ts';
import { showStudiosQuery } from '$lib/requests/queries/shows/showStudiosQuery.ts';
import { showSummaryQuery } from '$lib/requests/queries/shows/showSummaryQuery.ts';
import { streamShowQuery } from '$lib/requests/queries/shows/streamShowQuery.ts';
import { findPreferredStreamingService } from '$lib/stores/_internal/findPreferredStreamingService.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import { findRegionalIntl } from '$lib/utils/media/findRegionalIntl.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';

export function useShow(slug: string | undefined) {
  if (!slug) {
    return {
      isLoading: of(true),
      show: of(undefined),
      studios: of(undefined),
      crew: of(undefined),
      seasons: of(undefined),
      videos: of([]),
      intl: of(undefined),
      streamOn: of(undefined),
      sentiments: of(undefined),
    };
  }

  const { country, favorites } = useStreamingPreferences();

  const show = useQuery(showSummaryQuery({ slug }));
  const seasons = useQuery(showSeasonsQuery({ slug }));
  const studios = useQuery(showStudiosQuery({ slug }));
  const crew = useQuery(showPeopleQuery({ slug }));

  const streamOnQuery = useQuery(
    country.pipe(
      map((country) => streamShowQuery({ slug, country })),
    ),
  );

  const sentiments = useQuery(showSentimentsQuery({ slug }));

  const locale = languageTag();
  const isLocaleSkipped = locale === 'en';
  const { language } = getLanguageAndRegion();

  const intl = useQuery(
    showIntlQuery({ slug, language, enabled: !isLocaleSkipped }),
  );

  const queries = [
    show,
    intl,
    studios,
    crew,
    seasons,
    sentiments,
  ];

  const isLoading = combineLatest(queries).pipe(
    map(($queries) => $queries.some(toLoadingState)),
  );

  return {
    isLoading,
    show: show.pipe(map(($show) => $show.data)),
    studios: studios.pipe(map(($studios) => $studios.data)),
    crew: crew.pipe(map(($crew) => $crew.data)),
    seasons: seasons.pipe(map(($seasons) => $seasons.data)),
    sentiments: sentiments.pipe(map(($sentiments) => $sentiments.data)),
    intl: combineLatest([intl, show]).pipe(
      map(([$intl, $show]) =>
        findRegionalIntl({
          type: 'show',
          translations: $intl.data,
          fallback: $show.data,
        })
      ),
    ),
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
