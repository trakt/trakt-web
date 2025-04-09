import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { userListAllItemsQuery } from '$lib/requests/queries/users/userListAllItemsQuery.ts';

import { derived, readable } from 'svelte/store';

type UseIsListedProps = { list: MediaListSummary } & MediaStoreProps;

export function useIsListed(props: UseIsListedProps) {
  if (props.type === 'episode') {
    return { isListed: readable(false), itemCount: readable(0) };
  }

  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];

  const response = useQuery(userListAllItemsQuery({
    type: props.type,
    userId: props.list.user.slug ?? 'me',
    listId: props.list.slug,
  }));

  const isListed = derived(
    response,
    ($response) => {
      if (!$response.data) {
        return false;
      }

      switch (type) {
        case 'movie':
        case 'show':
          return media.every((m) =>
            $response.data.some((item) => item.entry.id === m.id)
          );
      }
    },
  );

  return {
    isListed,
    itemCount: derived(response, ($response) => $response.data?.length ?? 0),
  };
}
