import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import { episodeCommentsQuery } from '$lib/requests/queries/episode/episodeCommentsQuery.ts';
import { movieCommentsQuery } from '$lib/requests/queries/movies/movieCommentsQuery.ts';
import { showCommentsQuery } from '$lib/requests/queries/shows/showCommentsQuery.ts';
import { useStableArray } from '$lib/sections/lists/stores/useStableArray.ts';
import type {
  EpisodeCommentProps,
  MediaCommentProps,
} from '$lib/sections/summary/components/comments/CommentsProps.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { onMount } from 'svelte';
import { derived } from 'svelte/store';

type UseCommentsProps = {
  slug: string;
} & (MediaCommentProps | EpisodeCommentProps);

function typeToQuery(props: UseCommentsProps) {
  const slug = props.slug;

  switch (props.type) {
    case 'movie':
      return movieCommentsQuery({ slug }) as CreateQueryOptions<
        MediaComment[]
      >;
    case 'show':
      return showCommentsQuery({ slug }) as CreateQueryOptions<
        MediaComment[]
      >;
    case 'episode':
      return episodeCommentsQuery({
        slug,
        season: props.season,
        episode: props.episode,
      }) as CreateQueryOptions<
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

  const unstable = derived(query, ($query) => $query.data ?? []);
  const { list, set } = useStableArray<MediaComment>((l, r) => l.id === r.id);

  onMount(() => unstable.subscribe(set));

  return {
    isLoading,
    comments: list,
  };
}
