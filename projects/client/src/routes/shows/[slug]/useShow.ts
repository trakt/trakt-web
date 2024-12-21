import {
  showProgressQuery,
} from '$lib/requests/queries/shows/showProgressQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';
import { showRatingQuery } from '../../../lib/requests/queries/shows/showRatingQuery.ts';
import { showSummaryQuery } from '../../../lib/requests/queries/shows/showSummaryQuery.ts';

import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { showIntlQuery } from '$lib/requests/queries/shows/showIntlQuery.ts';
import { showStatsQuery } from '$lib/requests/queries/shows/showStatsQuery.ts';
import { showWatchersQuery } from '$lib/requests/queries/shows/showWatchersQuery.ts';

export function useShow(slug: string) {
  const show = createQuery(
    showSummaryQuery({
      slug,
    }),
  );

  const ratings = createQuery(
    showRatingQuery({
      slug,
    }),
  );

  const stats = createQuery(
    showStatsQuery({
      slug,
    }),
  );

  const watchers = createQuery(
    showWatchersQuery({
      slug,
    }),
  );

  const progress = createQuery(
    showProgressQuery({
      slug,
    }),
  );

  const locale = languageTag();
  const isLocaleSkipped = locale === 'en';

  const intl = isLocaleSkipped
    ? derived(show, ($show) => $show)
    : createQuery(showIntlQuery({ slug, ...getLanguageAndRegion() }));

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
