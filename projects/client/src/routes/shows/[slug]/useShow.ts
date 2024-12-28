import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { showIntlQuery } from '$lib/requests/queries/shows/showIntlQuery.ts';
import { showPeopleQuery } from '$lib/requests/queries/shows/showPeopleQuery.ts';
import { showProgressQuery } from '$lib/requests/queries/shows/showProgressQuery.ts';
import { showRatingQuery } from '$lib/requests/queries/shows/showRatingQuery.ts';
import { showSeasonsQuery } from '$lib/requests/queries/shows/showSeasonsQuery.ts';
import { showStatsQuery } from '$lib/requests/queries/shows/showStatsQuery.ts';
import { showStudiosQuery } from '$lib/requests/queries/shows/showStudiosQuery.ts';
import { showSummaryQuery } from '$lib/requests/queries/shows/showSummaryQuery.ts';
import { showWatchersQuery } from '$lib/requests/queries/shows/showWatchersQuery.ts';
import { time } from '$lib/utils/timing/time.ts';
import { createQuery } from '@tanstack/svelte-query';
import { onMount } from 'svelte';
import { derived } from 'svelte/store';

export function useShow(slug: string) {
  const show = createQuery({
    ...showSummaryQuery({ slug }),
    staleTime: time.days(1),
  });

  const ratings = createQuery({
    ...showRatingQuery({ slug }),
    staleTime: time.days(1),
  });

  const stats = createQuery({
    ...showStatsQuery({ slug }),
    staleTime: time.minutes(30),
  });

  const watchers = createQuery({
    ...showWatchersQuery({ slug }),
    staleTime: time.minutes(5),
  });

  const progress = createQuery({
    ...showProgressQuery({ slug }),
    staleTime: time.days(1),
  });

  const studios = createQuery({
    ...showStudiosQuery({ slug }),
    staleTime: time.days(1),
  });

  const crew = createQuery({
    ...showPeopleQuery({ slug }),
    staleTime: time.days(1),
  });

  const seasons = createQuery({
    ...showSeasonsQuery({ slug }),
    staleTime: time.days(1),
  });

  const locale = languageTag();
  const isLocaleSkipped = locale === 'en';

  const intl = isLocaleSkipped ? show : createQuery({
    ...showIntlQuery({ slug, ...getLanguageAndRegion() }),
    staleTime: time.days(7),
  });

  // TODO: remove this when we have empty state, make sure requests fire in parallel
  const queries = [
    show,
    ratings,
    stats,
    watchers,
    studios,
    progress,
    crew,
    seasons,
    intl,
  ];

  onMount(() => {
    queries.forEach((query) => query.subscribe(() => {}));
  });

  return {
    show: derived(show, ($show) => $show.data),
    ratings: derived(ratings, ($ratings) => $ratings.data),
    stats: derived(stats, ($stats) => $stats.data),
    watchers: derived(watchers, ($watchers) => $watchers.data),
    progress: derived(progress, ($progress) => $progress.data),
    studios: derived(studios, ($studios) => $studios.data),
    crew: derived(crew, ($crew) => $crew.data),
    seasons: derived(
      seasons,
      ($seasons) =>
        $seasons.data?.filter((season) =>
          season.episodes.count > 0 && season.number !== 0
        ),
    ),
    intl: derived(
      [show, intl],
      ([$show, $intl]) => {
        if (isLocaleSkipped) {
          return $intl.data;
        }

        if ($intl.isFetching) {
          return;
        }

        return {
          title: $intl?.data?.title ?? $show?.data?.title ?? '',
          overview: $intl?.data?.overview ?? $show?.data?.overview ?? '',
          tagline: $intl?.data?.tagline ?? $show?.data?.tagline ?? '',
        };
      },
    ),
  };
}
