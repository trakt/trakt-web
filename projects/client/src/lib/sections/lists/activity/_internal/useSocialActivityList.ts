import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { socialActivityQuery } from '$lib/requests/queries/users/socialActivityQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';

type SocialActivityListProps = PaginationParams;

function typeToQuery(
  { limit, page }: SocialActivityListProps,
) {
  const params = {
    limit,
    page,
  };

  return socialActivityQuery(params);
}

export function useSocialActivityList(
  props: SocialActivityListProps,
) {
  return usePaginatedListQuery(typeToQuery(props));
}
