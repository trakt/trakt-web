import {
  useAllPagesInfiniteQuery,
  useQuery,
} from '$lib/features/query/useQuery.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { collaborationListsQuery } from '$lib/requests/queries/users/collaborationListsQuery.ts';
import { personalListsQuery } from '$lib/requests/queries/users/personalListsQuery.ts';
import {
  type UserList,
  userListsQuery,
} from '$lib/requests/queries/users/userListsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { combineLatest, map } from 'rxjs';

// The minimal lists payload carries no slugs, so overlay them from the list
// summary queries - rows link to canonical list URLs once the summaries land
// and fall back to id-based URLs until then.
function withListSlugs(
  list: UserList,
  summary: MediaListSummary | undefined,
): UserList {
  if (!summary) {
    return list;
  }

  return {
    ...list,
    slug: list.slug ?? summary.slug,
    ownerSlug: list.ownerSlug ?? summary.user.slug,
  };
}

export function useAllPersonalLists() {
  const lists = useQuery(userListsQuery());
  const personal = useAllPagesInfiniteQuery(
    personalListsQuery({ slug: 'me', limit: 1000 }),
  );
  const collaborations = useAllPagesInfiniteQuery(
    collaborationListsQuery({ slug: 'me' }),
  );

  const summaries = combineLatest([personal, collaborations]).pipe(
    map(([$personal, $collaborations]) =>
      new Map(
        [$personal, $collaborations]
          .flatMap((query) =>
            query.data?.pages.flatMap((page) => page.entries) ?? []
          )
          .map((summary) => [summary.id, summary] as const),
      )
    ),
  );

  const isLoading = lists.pipe(map(toLoadingState));

  return {
    lists: combineLatest([lists, summaries]).pipe(
      map(([$lists, $summaries]) =>
        ($lists.data ?? []).map((list) =>
          withListSlugs(list, $summaries.get(list.id))
        )
      ),
    ),
    isLoading,
  };
}
