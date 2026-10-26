import { collaborationListsQuery } from '$lib/requests/queries/users/collaborationListsQuery.ts';
import type { UserListsSortBy } from '$lib/requests/models/UserListsSortBy.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { personalListsQuery } from '$lib/requests/queries/users/personalListsQuery.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { dedupe } from '$lib/utils/array/dedupe.ts';
import { combineLatest, map, of } from 'rxjs';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { likedListsQuery } from '$lib/requests/queries/users/likedListsQuery.ts';
import { DEFAULT_LISTS_PAGE_SIZE } from '$lib/utils/constants.ts';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';
import type { PersonalListType } from './models/PersonalListType.ts';
import type { SortDirection } from './models/SortDirection.ts';
import { defaultDirection } from './defaultDirection.ts';
import { sortCollaborationLists } from './_internal/sortCollaborationLists.ts';
import { useOwnSharedLists } from './useOwnSharedLists.ts';

type PersonalListsParams = {
  type: PersonalListType;
  slug: string;
  sortBy?: UserListsSortBy | Nil;
  sortHow?: SortDirection | Nil;
} & Partial<PaginationParams>;

type CollaborationListsParams = {
  slug: string;
  sortBy?: UserListsSortBy | Nil;
  sortHow: SortDirection;
};

function sortByUpdatedAt(lists: MediaListSummary[], sortHow: SortDirection) {
  return lists.toSorted((a, b) => {
    const diff = a.updatedAt.getTime() - b.updatedAt.getTime();
    return sortHow === 'asc' ? diff : -diff;
  });
}

function defaultSortBy(type: PersonalListType): UserListsSortBy | undefined {
  switch (type) {
    case 'personal':
      return 'rank';
    case 'liked':
      return 'updated_at';
    case 'shared':
      return undefined;
  }
}

function typeToQuery({
  type,
  slug,
  limit,
  sortBy,
  sortHow,
}: PersonalListsParams & {
  type: Exclude<PersonalListType, 'shared'>;
}) {
  const paginationProps = {
    limit: limit ?? DEFAULT_LISTS_PAGE_SIZE,
  };

  switch (type) {
    case 'liked':
      return likedListsQuery(paginationProps);
    case 'personal':
      return personalListsQuery({
        slug,
        collaborative: false,
        sortBy,
        sortHow,
        ...paginationProps,
      });
  }
}

function useCollaborationLists({
  slug,
  sortBy,
  sortHow,
}: CollaborationListsParams) {
  const owned = useOwnSharedLists(slug);
  const shared = useQuery(collaborationListsQuery({ slug }));

  return {
    list: combineLatest([
      owned.list,
      shared.pipe(map(($query) => $query.data ?? [])),
    ]).pipe(
      map(([$owned, $shared]) =>
        sortCollaborationLists({
          owned: $owned,
          shared: $shared,
          sortBy,
          sortHow,
        }),
      ),
    ),
    isLoading: combineLatest([
      owned.isLoading,
      shared.pipe(map(toLoadingState)),
    ]).pipe(map((states) => states.some(Boolean))),
    hasNextPage: of(false),
    fetchNextPage: () => Promise.resolve(),
  };
}

function useListsQuery(
  params: PersonalListsParams & { sortHow: SortDirection },
) {
  const { type } = params;

  if (type === 'shared') {
    return useCollaborationLists(params);
  }

  return usePaginatedListQuery(typeToQuery({ ...params, type }));
}

export function usePersonalListsSummary({
  type,
  slug,
  limit,
  sortBy,
  sortHow,
}: PersonalListsParams) {
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
      map(($list) => {
        // FIXME: figure out the root cause of duplicates
        const deduped = dedupe((item) => item.id, $list);

        if (type !== 'liked' || resolvedSortBy !== 'updated_at') {
          return deduped;
        }

        return sortByUpdatedAt(deduped, resolvedSortHow);
      }),
    ),
  };
}
