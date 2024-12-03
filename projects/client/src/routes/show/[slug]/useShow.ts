import { browser } from '$app/environment';
import {
  showProgressQuery,
  showProgressQueryKey,
} from '$lib/requests/queries/shows/showProgressQuery.ts';
import { createQuery, useQueryClient } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';
import { showRatingQuery } from '../../../lib/requests/queries/shows/showRatingQuery.ts';
import { showSummaryQuery } from '../../../lib/requests/queries/shows/showSummaryQuery.ts';

import { languageTag } from '$lib/features/i18n/index.ts';
import { showIntlQuery } from '$lib/requests/queries/shows/showIntlQuery.ts';

export function useShow(slug: string) {
  const client = browser ? useQueryClient() : undefined;

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

  const progress = createQuery(
    showProgressQuery({
      slug,
    }),
  );

  const reload = () => {
    client?.resetQueries({
      queryKey: showProgressQueryKey(slug),
    });
  };

  const locale = languageTag();
  const intl = locale === 'en'
    ? show
    : createQuery(showIntlQuery({ slug, locale: languageTag() }));

  return {
    show: derived(show, ($movie) => $movie.data),
    ratings: derived(ratings, ($ratings) => $ratings.data),
    progress: derived(progress, ($progress) => $progress.data),
    intl: derived(
      [show, intl],
      ([$show, $intl]) => {
        if ($intl.isFetching) {
          return undefined;
        }

        return {
          title: $intl?.data?.title ?? $show?.data?.title ?? '',
          overview: $intl?.data?.overview ?? $show?.data?.overview ?? '',
          tagline: $intl?.data?.tagline ?? $show?.data?.tagline ?? '',
        };
      },
    ),
    reload,
  };
}
