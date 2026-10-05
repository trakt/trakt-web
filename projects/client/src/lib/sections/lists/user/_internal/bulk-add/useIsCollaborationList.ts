import {
  useAllPagesInfiniteQuery,
  useQuery,
} from '$lib/features/query/useQuery.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { listCollaboratorsQuery } from '$lib/requests/queries/lists/listCollaboratorsQuery.ts';
import { collaborationListsQuery } from '$lib/requests/queries/users/collaborationListsQuery.ts';
import { combineLatest, map, type Observable } from 'rxjs';

type UseIsCollaborationListProps = {
  list$: Observable<MediaListSummary>;
  userSlug: string;
};

export function useIsCollaborationList(
  { list$, userSlug }: UseIsCollaborationListProps,
) {
  const collaborationLists = useAllPagesInfiniteQuery(
    collaborationListsQuery({ slug: userSlug }),
  );
  const collaborators = useQuery(
    list$.pipe(map(({ id }) => listCollaboratorsQuery({ listId: id }))),
  );

  const isCollaboration = combineLatest([
    list$,
    collaborationLists,
    collaborators,
  ]).pipe(
    map(([list, $lists, $collaborators]) => {
      const isCollaborator = ($lists.data?.pages ?? [])
        .flatMap((page) => page.entries)
        .some(({ id }) => id === list.id);
      const isOwnerOfSharedList = list.user.slug === userSlug &&
        ($collaborators.data ?? []).length > 0;

      return isCollaborator || isOwnerOfSharedList;
    }),
  );

  return { isCollaboration };
}
