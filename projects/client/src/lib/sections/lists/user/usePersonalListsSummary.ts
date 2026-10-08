import { collaborationListsQuery } from '$lib/requests/queries/users/collaborationListsQuery.ts';
import type { UserListsSortBy } from '$lib/requests/models/UserListsSortBy.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { personalListsQuery } from '$lib/requests/queries/users/personalListsQuery.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { dedupe } from '$lib/utils/array/dedupe.ts';
import { map, of } from 'rxjs';
import type { PaginationParams } from '../../../requests/models/PaginationParams.ts';
import { likedListsQuery } from '../../../requests/queries/users/likedListsQuery.ts';
import { DEFAULT_LISTS_PAGE_SIZE } from '../../../utils/constants.ts';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';
import type { PersonalListType } from './models/PersonalListType.ts';
import type { SortDirection } from './models/SortDirection.ts';
import { defaultDirection } from './defaultDirection.ts';

type PersonalListsParams = {
  type: PersonalListType;
  slug: string;
  sortBy?: UserListsSortBy | Nil;
  sortHow?: SortDirection | Nil;
} & Partial<PaginationParams>;

function sortByUpdatedAt(
  lists: MediaListSummary[],
  sortHow: SortDirection,
) {
  return lists.toSorted((a, b) => {
    const diff = a.updatedAt.getTime() - b.updatedAt.getTime();
    return sortHow === 'asc' ? diff : -diff;
  });
}

function defaultSortBy(type: PersonalListType): UserListsSortBy {
  return type === 'personal' ? 'rank' : 'updated_at';
}

function typeToQuery(
  { type, slug, limit, sortBy, sortHow }: PersonalListsParams & {
    type: Exclude<PersonalListType, 'collaboration'>;
  },
) {
  const paginationProps = {
    limit: limit ?? DEFAULT_LISTS_PAGE_SIZE,
  };

  switch (type) {
    case 'liked':
      return likedListsQuery(paginationProps);
    case 'personal':
      return personalListsQuery({
        slug,
        sortBy,
        sortHow,
        ...paginationProps,
      });
  }
}

function useCollaborationLists(slug: string) {
  const query = useQuery(collaborationListsQuery({ slug }));

  return {
    list: query.pipe(map(($query) => $query.data ?? [])),
    isLoading: query.pipe(map(toLoadingState)),
    hasNextPage: of(false),
    fetchNextPage: () => Promise.resolve(),
  };
}

function useListsQuery(params: PersonalListsParams) {
  const { type } = params;

  if (type === 'collaboration') {
    return useCollaborationLists(params.slug);
  }

  return usePaginatedListQuery(typeToQuery({ ...params, type }));
}

export function usePersonalListsSummary(
  {
    type,
    slug,
    limit,
    sortBy,
    sortHow,
  }: PersonalListsParams,
) {
  const resolvedSortBy = sortBy ?? defaultSortBy(type);
  const resolvedSortHow = sortHow ?? defaultDirection(resolvedSortBy);
  const { list, ...rest } = useListsQuery({
    type,
    slug,
    limit,
    sortBy: resolvedSortBy,
    sortHow: resolvedSortHow,
  });

  return {
    ...rest,
    list: list.pipe(
      map(
        ($list) => {
          // FIXME: figure out the root cause of duplicates
          const deduped = dedupe((item) => item.id, $list);

          if (type === 'personal' || resolvedSortBy !== 'updated_at') {
            return deduped;
          }

          return sortByUpdatedAt(deduped, resolvedSortHow);
        },
      ),
    ),
  };
}
