import { collaborationListsQuery } from '$lib/requests/queries/users/collaborationListsQuery.ts';
import type { UserListsSortBy } from '$lib/requests/models/UserListsSortBy.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { personalListsQuery } from '$lib/requests/queries/users/personalListsQuery.ts';
import { dedupe } from '$lib/utils/array/dedupe.ts';
import { distinctUntilChanged, map, type Observable } from 'rxjs';
import type { PaginationParams } from '../../../requests/models/PaginationParams.ts';
import { likedListsQuery } from '../../../requests/queries/users/likedListsQuery.ts';
import { DEFAULT_LISTS_PAGE_SIZE } from '../../../utils/constants.ts';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';
import type { PersonalListType } from './models/PersonalListType.ts';
import type { SortDirection } from './models/SortDirection.ts';

type PersonalListsParams = {
  type: PersonalListType;
  slug: string;
  sortBy?: UserListsSortBy | Nil;
  sortHow?: SortDirection | Nil;
  terms?: string | Nil;
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

function typeToQuery(
  { type, slug, limit, sortBy, sortHow, terms }: PersonalListsParams,
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
        terms,
        ...paginationProps,
      });
    case 'collaboration':
      return collaborationListsQuery({ slug });
  }
}

type UsePersonalListsSummaryParams = Omit<PersonalListsParams, 'terms'> & {
  /**
   * Search term as a stream, so a new term updates the one query observer's
   * options instead of rebuilding the query.
   */
  terms$?: Observable<string | Nil>;
};

export function usePersonalListsSummary(
  {
    type,
    slug,
    limit,
    sortBy,
    sortHow,
    terms$,
  }: UsePersonalListsSummaryParams,
) {
  const resolvedSortBy = sortBy ?? 'updated_at';
  const resolvedSortHow = sortHow ?? 'desc';
  const toQuery = (terms?: string | Nil) =>
    typeToQuery({
      type,
      slug,
      limit,
      sortBy: resolvedSortBy,
      sortHow: resolvedSortHow,
      terms,
    });

  const { list, ...rest } = usePaginatedListQuery(
    terms$
      ? terms$.pipe(distinctUntilChanged(), map((terms) => toQuery(terms)))
      : toQuery(),
  );

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
