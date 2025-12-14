import { collaborationListsQuery } from '$lib/requests/queries/users/collaborationListsQuery.ts';
import { personalListsQuery } from '$lib/requests/queries/users/personalListsQuery.ts';
import { map } from 'rxjs';
import type { PaginationParams } from '../../../requests/models/PaginationParams.ts';
import { likedListsQuery } from '../../../requests/queries/users/likedListsQuery.ts';
import { DEFAULT_LISTS_PAGE_SIZE } from '../../../utils/constants.ts';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';
import type { PersonalListType } from './models/PersonalListType.ts';

type PersonalListsParams = {
  type: PersonalListType;
  slug: string;
  sortBy?: 'none' | 'recently-updated';
} & Partial<PaginationParams>;

function typeToQuery({ type, slug, limit }: PersonalListsParams) {
  const paginationProps = {
    limit: limit ?? DEFAULT_LISTS_PAGE_SIZE,
  };

  switch (type) {
    case 'liked':
      return likedListsQuery(paginationProps);
    case 'personal':
      return personalListsQuery({ slug, ...paginationProps });
    case 'collaboration':
      return collaborationListsQuery({ slug });
  }
}

export function usePersonalListsSummary(
  { type, slug, limit, sortBy = 'recently-updated' }: PersonalListsParams,
) {
  const { list, ...rest } = usePaginatedListQuery(
    typeToQuery({ type, slug, limit }),
  );

  return {
    ...rest,
    list: list.pipe(
      map(
        ($list) => {
          if (sortBy === 'none') {
            return $list;
          }

          return $list.toSorted((a, b) =>
            // FIXME: update when we add sorting options
            b.updatedAt.getTime() - a.updatedAt.getTime()
          );
        },
      ),
    ),
  };
}
