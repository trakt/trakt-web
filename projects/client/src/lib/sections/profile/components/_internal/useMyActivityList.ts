import type { InfiniteQuery } from '$lib/features/query/models/InfiniteQuery.ts';
import type { UserCommentEntry } from '$lib/requests/queries/users/userCommentsQuery.ts';
import { userCommentsQuery } from '$lib/requests/queries/users/userCommentsQuery.ts';
import { DEFAULT_PAGE_SIZE } from '../../../../utils/constants.ts';
import { usePaginatedListQuery } from '../../../lists/stores/usePaginatedListQuery.ts';

export type ActivityEntry = UserCommentEntry;

type UseMyActivityListProps = {
  type: 'reviews';
  slug?: string;
  limit?: number;
};

function typeToQuery(
  props: UseMyActivityListProps,
): InfiniteQuery<ActivityEntry> {
  const slug = props.slug ?? 'me';
  const limit = props.limit ?? DEFAULT_PAGE_SIZE;

  switch (props.type) {
    case 'reviews':
      return userCommentsQuery({ slug, limit });
  }
}

export function useMyActivityList(props: UseMyActivityListProps) {
  return usePaginatedListQuery(typeToQuery(props));
}
