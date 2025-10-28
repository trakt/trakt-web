import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { episodeIntlQuery } from '$lib/requests/queries/episode/episodeIntlQuery.ts';
import { episodePeopleQuery } from '$lib/requests/queries/episode/episodePeopleQuery.ts';
import { episodeSummaryQuery } from '$lib/requests/queries/episode/episodeSummaryQuery.ts';
import { streamEpisodeQuery } from '$lib/requests/queries/episode/streamEpisodeQuery.ts';
import { showIntlQuery } from '$lib/requests/queries/shows/showIntlQuery.ts';
import { showSeasonsQuery } from '$lib/requests/queries/shows/showSeasonsQuery.ts';
import { showSummaryQuery } from '$lib/requests/queries/shows/showSummaryQuery.ts';
import { useStreamingPreferences } from '$lib/stores/useStreamingPreferences.ts';
import { findRegionalIntl } from '$lib/utils/media/findRegionalIntl.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { map, switchMap } from 'rxjs/operators';
import { derived } from 'svelte/store';

type UseEpisodeParams = {
  slug: string;
  season: number;
  episode: number;
};

export function useEpisode(
  params: UseEpisodeParams,
) {
  const { country, getPreferred } = useStreamingPreferences();

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
      switchMap((country) =>
        toObservable(useQuery(streamEpisodeQuery({ ...params, country })))
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

  const isLoading = derived(
    queries,
    ($queries) => $queries.some(toLoadingState),
  );

  return {
    isLoading,
    episode: derived(episode, ($episode) => $episode.data),
    show: derived(show, ($show) => $show.data),
    seasons: derived(
      [seasons, episode],
      ([$seasons, $episode]) =>
        $seasons.data?.filter((season) =>
          season.number === $episode.data?.season
        ),
    ),
    crew: derived(crew, ($crew) => $crew.data),
    intl: derived(
      [intl, episode],
      ([$intl, $episode]) =>
        findRegionalIntl({
          type: 'episode',
          translations: $intl.data,
          fallback: $episode.data,
        }),
    ),
    showIntl: derived(
      [showIntl, show],
      ([$showIntl, $show]) =>
        findRegionalIntl({
          type: 'show',
          translations: $showIntl.data,
          fallback: $show.data,
        }),
    ),
    // FIXME: move these to the 'where to watch' component
    streamOn: streamOn.pipe(
      map(($streamOn) => {
        if (!$streamOn.data) {
          return;
        }

        return {
          services: $streamOn.data,
          preferred: getPreferred($streamOn.data),
        };
      }),
    ),
  };
}
