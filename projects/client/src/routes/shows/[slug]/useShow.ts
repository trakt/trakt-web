import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { showIntlQuery } from '$lib/requests/queries/shows/showIntlQuery.ts';
import { showSummaryQuery } from '$lib/requests/queries/shows/showSummaryQuery.ts';
import { derived } from 'svelte/store';

export function useShow(slug: string) {
  const show = useQuery(showSummaryQuery({ slug }));

  const locale = languageTag();
  const isLocaleSkipped = locale === 'en';

  const intl = isLocaleSkipped
    ? show
    : useQuery(showIntlQuery({ slug, ...getLanguageAndRegion() }));

  const queries = [
    show,
    intl,
  ];

  const isLoading = derived(
    queries,
    ($queries) => $queries.some((query) => query.isPending),
  );

  return {
    isLoading,
    show: derived(show, ($show) => $show.data),
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
