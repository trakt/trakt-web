import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { useAllPagesInfiniteQuery } from '$lib/features/query/useQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { ListItem } from '$lib/requests/models/ListItem.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { listItemsQuery } from '$lib/requests/queries/lists/listItemsQuery.ts';
import { addToListRequest } from '$lib/requests/queries/users/addToListRequest.ts';
import { createListRequest } from '$lib/requests/queries/users/createListRequest.ts';
import { userListItemsQuery } from '$lib/requests/queries/users/userListItemsQuery.ts';
import { filter, firstValueFrom, map, tap } from 'rxjs';
import type { SaveListProps } from './useSaveList.ts';
import { toCloneListPayload } from './toCloneListPayload.ts';

const CLONE_PAGE_SIZE = 100;

function toItemsQuery(list: MediaListSummary) {
  if (list.user.slug) {
    return userListItemsQuery({
      userId: list.user.slug,
      listId: list.slug,
      limit: CLONE_PAGE_SIZE,
    });
  }

  return listItemsQuery({
    listId: `${list.id}`,
    limit: CLONE_PAGE_SIZE,
  });
}

export function useCloneList(list: MediaListSummary) {
  const { track } = useTrack(AnalyticsEvent.ListClone);

  const query = useAllPagesInfiniteQuery(toItemsQuery(list));

  /**
   * Every page has to land before the clone is written, otherwise the copy
   * silently drops the items that were not fetched yet.
   */
  const items = query.pipe(
    tap(($query) => {
      if ($query.isError) {
        throw $query.error;
      }
    }),
    filter(($query) =>
      !$query.isPending && !$query.isFetchingNextPage && !$query.hasNextPage
    ),
    map(($query) => $query.data?.pages.flatMap((page) => page.entries) ?? []),
  );

  const clone = useMutation(defineMutation({
    key: 'list:clone',
    /**
     * `sortBy` / `sortHow` are part of the shared save shape but the create
     * endpoint does not accept them, so a clone keeps the defaults.
     */
    request: async (
      { name, description, privacy }: SaveListProps,
    ): Promise<string | Nil> => {
      const entries: ListItem[] = await firstValueFrom(items);

      const created = await createListRequest({
        userId: 'me',
        name,
        description,
        privacy,
      });

      if (!created) {
        return undefined;
      }

      if (entries.length > 0) {
        await addToListRequest({
          listId: created.id,
          body: toCloneListPayload(entries),
        });
      }

      return created.slug;
    },
    invalidations: [
      InvalidateAction.List.Created,
      InvalidateAction.Listed('movie'),
      InvalidateAction.Listed('show'),
    ],
  }));

  const saveList = async (
    { name, description, privacy }: SaveListProps,
  ): Promise<string | Nil> => {
    const newName = name.trim();

    if (!newName) {
      return undefined;
    }

    track();

    return await clone.mutate({ name: newName, description, privacy });
  };

  return {
    isSaving: clone.isPending,
    saveList,
  };
}
