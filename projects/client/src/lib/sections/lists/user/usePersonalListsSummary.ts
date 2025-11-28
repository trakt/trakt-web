import { collaborationListsQuery } from '$lib/requests/queries/users/collaborationListsQuery.ts';
import { personalListsQuery } from '$lib/requests/queries/users/personalListsQuery.ts';
import { derived } from 'svelte/store';
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

function typeToQuery({ type, slug, page, limit }: PersonalListsParams) {
  const paginationProps = {
    page: page ?? 1,
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
  { type, slug, page, limit, sortBy = 'recently-updated' }: PersonalListsParams,
) {
  const { list, ...rest } = usePaginatedListQuery(
    typeToQuery({ type, slug, page, limit }),
  );

  return {
    ...rest,
    list: derived(
      list,
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
  };
}
