import { useQuery } from '$lib/features/query/useQuery.ts';
import type { CommentSortType } from '$lib/requests/models/CommentSortType.ts';
import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import { episodeCommentsQuery } from '$lib/requests/queries/episode/episodeCommentsQuery.ts';
import { movieCommentsQuery } from '$lib/requests/queries/movies/movieCommentsQuery.ts';
import { showCommentsQuery } from '$lib/requests/queries/shows/showCommentsQuery.ts';
import type {
  EpisodeCommentProps,
  MediaCommentProps,
} from '$lib/sections/summary/components/comments/CommentsProps.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { map } from 'rxjs';

const COMMENT_LIMIT = 10;

type UseCommentsProps = {
  slug: string;
  limit?: number | 'all';
  sort: CommentSortType;
} & (MediaCommentProps | EpisodeCommentProps);

function typeToCommentsQuery(props: UseCommentsProps) {
  const commonProps = {
    slug: props.slug,
    limit: props.limit ?? COMMENT_LIMIT,
    sort: props.sort,
  };

  switch (props.type) {
    case 'movie':
      return movieCommentsQuery(commonProps) as CreateQueryOptions<
        MediaComment[]
      >;
    case 'show':
      return showCommentsQuery(commonProps) as CreateQueryOptions<
        MediaComment[]
      >;
    case 'episode':
      return episodeCommentsQuery({
        ...commonProps,
        season: props.season,
        episode: props.episode,
      }) as CreateQueryOptions<
        MediaComment[]
      >;
  }
}

export function useComments(props: UseCommentsProps) {
  const comments = useQuery(typeToCommentsQuery(props));

  return {
    isLoading: comments.pipe(map(($comments) => toLoadingState($comments))),
    comments: comments.pipe(map(($comments) => $comments.data ?? [])),
  };
}
