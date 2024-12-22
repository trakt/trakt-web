import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { showIntlQuery } from '$lib/requests/queries/shows/showIntlQuery.ts';
import { showProgressQuery } from '$lib/requests/queries/shows/showProgressQuery.ts';
import { showRatingQuery } from '$lib/requests/queries/shows/showRatingQuery.ts';
import { showStatsQuery } from '$lib/requests/queries/shows/showStatsQuery.ts';
import { showSummaryQuery } from '$lib/requests/queries/shows/showSummaryQuery.ts';
import { showWatchersQuery } from '$lib/requests/queries/shows/showWatchersQuery.ts';
import { time } from '$lib/utils/timing/time.ts';
import { createQuery } from '@tanstack/svelte-query';
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

  const locale = languageTag();
  const isLocaleSkipped = locale === 'en';

  const intl = isLocaleSkipped ? show : createQuery({
    ...showIntlQuery({ slug, ...getLanguageAndRegion() }),
    staleTime: time.days(7),
  });

  return {
    show: derived(show, ($show) => $show.data),
    ratings: derived(ratings, ($ratings) => $ratings.data),
    stats: derived(stats, ($stats) => $stats.data),
    watchers: derived(watchers, ($watchers) => $watchers.data ?? []),
    progress: derived(progress, ($progress) => $progress.data),
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
