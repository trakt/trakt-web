import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';

import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { userListAllMovieItemsQuery } from '$lib/requests/queries/users/userListAllMovieItemsQuery.ts';
import { userListAllShowItemsQuery } from '$lib/requests/queries/users/userListAllShowItemsQuery.ts';
import { derived, readable } from 'svelte/store';

type UseIsListedProps = { list: MediaListSummary } & MediaStoreProps;

function typeToQuery(type: MediaType, props: UseIsListedProps) {
  const params = {
    userId: props.list.user.slug ?? 'me',
    listId: props.list.slug,
  };

  switch (type) {
    case 'movie':
      return userListAllMovieItemsQuery(params);
    case 'show':
      return userListAllShowItemsQuery(params);
  }
}

export function useIsListed(props: UseIsListedProps) {
  if (props.type === 'episode') {
    return { isListed: readable(false), itemCount: readable(0) };
  }

  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];

  const response = useQuery(typeToQuery(props.type, props));

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
