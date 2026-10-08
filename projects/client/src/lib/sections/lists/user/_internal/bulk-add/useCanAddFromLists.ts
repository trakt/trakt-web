import {
  useAllPagesInfiniteQuery,
  useQuery,
} from '$lib/features/query/useQuery.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { listCollaboratorsQuery } from '$lib/requests/queries/lists/listCollaboratorsQuery.ts';
import { collaborationListsQuery } from '$lib/requests/queries/users/collaborationListsQuery.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import { toAddFromListsAccess } from './toAddFromListsAccess.ts';

type UseCanAddFromListsProps = {
  list$: Observable<MediaListSummary>;
  userSlug: string;
};

export function useCanAddFromLists(
  { list$, userSlug }: UseCanAddFromListsProps,
) {
  const collaborationLists = useAllPagesInfiniteQuery(
    collaborationListsQuery({ slug: userSlug }),
  );
  const collaborators = useQuery(
    list$.pipe(map(({ id }) => listCollaboratorsQuery({ listId: id }))),
  );

  const access = combineLatest([
    list$,
    collaborationLists,
    collaborators,
  ]).pipe(
    map(([list, $lists, $collaborators]) =>
      toAddFromListsAccess({
        isOwner: list.user.slug === userSlug,
        isCollaborator: ($lists.data?.pages ?? [])
          .flatMap((page) => page.entries)
          .some(({ id }) => id === list.id),
        hasCollaborators: ($collaborators.data ?? []).length > 0,
      })
    ),
  );

  return {
    canAddFromLists: access.pipe(map(({ canAddFromLists }) => canAddFromLists)),
    isSharedList: access.pipe(map(({ isSharedList }) => isSharedList)),
  };
}
