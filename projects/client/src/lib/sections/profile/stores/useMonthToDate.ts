import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { languageTag } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { movieActivityHistoryQuery } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import { showActivityHistoryQuery } from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { getPreviousMonth } from '$lib/utils/date/getPreviousMonth.ts';
import { toHumanMonth } from '$lib/utils/formatting/date/toHumanMonth.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { derived } from 'svelte/store';
import { mapToMonthToDateDetails } from './_internal/mapToMonthToDateDetails.ts';

const HISTORY_LIMIT = 1000;

type UseMonthToDateProps = {
  slug: string;
};

export function useMonthToDate({ slug }: UseMonthToDateProps) {
  const { user } = useUser();

  const now = new Date();

  const params = {
    limit: HISTORY_LIMIT,
    slug,
    startDate: new Date(now.getFullYear(), now.getMonth(), 1),
    endDate: now,
  };

  const movies = useQuery(movieActivityHistoryQuery(params));
  const shows = useQuery(showActivityHistoryQuery(params));

  return {
    monthToDate: derived(
      [movies, shows],
      ([$movies, $shows]) => {
        return mapToMonthToDateDetails(
          $movies.data?.entries ?? [],
          $shows.data?.entries ?? [],
        );
      },
    ),
    monthInReview: derived(user, ($user) => {
      const mirDate = getPreviousMonth(now);

      const isCurrentUser = $user.slug === slug || slug === 'me';
      const token = isCurrentUser ? $user.token : undefined;

      // FIXME: always use iframe route when the kinks are ironed out
      const target = $user.isDirector ? '_self' as const : '_blank' as const;
      const href = $user.isDirector
        ? UrlBuilder.users(slug).monthInReview(
          mirDate.getFullYear(),
          mirDate.getMonth() + 1,
        )
        : UrlBuilder.og.monthInReview(slug, token);

      return {
        href,
        target,
        label: toHumanMonth(mirDate, languageTag()),
      };
    }),
    isLoading: derived(
      [movies, shows],
      ($queries) => $queries.some((query) => query.isPending),
    ),
  };
}
