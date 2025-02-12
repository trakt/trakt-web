import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { movieCommentsQuery } from '$lib/requests/queries/movies/movieCommentsQuery.ts';
import { showCommentsQuery } from '$lib/requests/queries/shows/showCommentsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

type UseCommentsProps = {
  slug: string;
  type: MediaType;
};

function typeToQuery({
  slug,
  type,
}: UseCommentsProps) {
  switch (type) {
    case 'movie':
      return movieCommentsQuery({ slug }) as CreateQueryOptions<
        MediaComment[]
      >;
    case 'show':
      return showCommentsQuery({ slug }) as CreateQueryOptions<
        MediaComment[]
      >;
  }
}

export function useComments(props: UseCommentsProps) {
  const query = useQuery(typeToQuery(props));

  const isLoading = derived(
    query,
    toLoadingState,
  );

  return {
    isLoading,
    comments: derived(query, ($query) => $query.data ?? []),
  };
}
