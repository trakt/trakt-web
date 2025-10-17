import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { showIntlQuery } from '$lib/requests/queries/shows/showIntlQuery.ts';
import { showPeopleQuery } from '$lib/requests/queries/shows/showPeopleQuery.ts';
import { showSeasonsQuery } from '$lib/requests/queries/shows/showSeasonsQuery.ts';
import { showStudiosQuery } from '$lib/requests/queries/shows/showStudiosQuery.ts';
import { showSummaryQuery } from '$lib/requests/queries/shows/showSummaryQuery.ts';
import { streamShowQuery } from '$lib/requests/queries/shows/streamShowQuery.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import { findRegionalIntl } from '$lib/utils/media/findRegionalIntl.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived, get, readable } from 'svelte/store';

export function useShow(slug: string | undefined) {
  if (!slug) {
    return {
      isLoading: readable(true),
      show: readable(undefined),
      studios: readable(undefined),
      crew: readable(undefined),
      seasons: readable(undefined),
      videos: readable([]),
      intl: readable(undefined),
      streamOn: readable(undefined),
    };
  }

  const { country, getPreferred } = useStreamingPreferences();

  const show = useQuery(showSummaryQuery({ slug }));
  const seasons = useQuery(showSeasonsQuery({ slug }));
  const studios = useQuery(showStudiosQuery({ slug }));
  const crew = useQuery(showPeopleQuery({ slug }));
  const streamOn = useQuery(streamShowQuery({ slug, country: get(country) }));

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
    streamOn,
  ];

  const isLoading = derived(
    queries,
    ($queries) => $queries.some(toLoadingState),
  );

  return {
    isLoading,
    show: derived(show, ($show) => $show.data),
    studios: derived(studios, ($studios) => $studios.data),
    crew: derived(crew, ($crew) => $crew.data),
    seasons: derived(seasons, ($seasons) => $seasons.data),
    intl: derived([intl, show], ([$intl, $show]) => {
      if (($intl.isEnabled && $intl.isFetching) || $show.isFetching) {
        return;
      }

      return findRegionalIntl({
        type: 'show',
        translations: $intl.data,
        fallback: $show.data,
      });
    }),
    streamOn: derived(streamOn, ($streamOn) => {
      if (!$streamOn.data) {
        return;
      }

      return {
        services: $streamOn.data,
        preferred: getPreferred($streamOn.data),
      };
    }),
  };
}
