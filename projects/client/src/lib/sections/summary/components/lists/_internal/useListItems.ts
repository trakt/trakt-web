import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import {
  type ListedMovie,
  listMovieItemsQuery,
} from '$lib/requests/queries/lists/listMovieItemsQuery.ts';
import {
  type ListedShow,
  listShowItemsQuery,
} from '$lib/requests/queries/lists/listShowItemsQuery.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';

import { derived } from 'svelte/store';

const PREVIEW_LIMIT = 8;

type ListedMediaItem = ListedMovie | ListedShow;

type UseListItemsProps = {
  id: number;
  type: MediaType;
};

function typeToQuery(
  { id, type }: UseListItemsProps,
) {
  const params = {
    id,
    limit: PREVIEW_LIMIT,
  };

  switch (type) {
    case 'movie':
      return listMovieItemsQuery(params) as CreateQueryOptions<
        Array<ListedMediaItem>
      >;
    case 'show':
      return listShowItemsQuery(params) as CreateQueryOptions<
        Array<ListedMediaItem>
      >;
  }
}

export function useListItems({
  id,
  type,
}: UseListItemsProps) {
  const items = useQuery(typeToQuery({ id, type }));

  return {
    items: derived(items, ($list) => $list.data ?? []),
  };
}
