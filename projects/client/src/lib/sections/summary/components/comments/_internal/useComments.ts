import { useQuery } from '$lib/features/query/useQuery.ts';
import type { CommentSortType } from '$lib/requests/models/CommentSortType.ts';
import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import { episodeCommentsQuery } from '$lib/requests/queries/episode/episodeCommentsQuery.ts';
import { movieCommentsQuery } from '$lib/requests/queries/movies/movieCommentsQuery.ts';
import { movieSentimentsQuery } from '$lib/requests/queries/movies/movieSentimentsQuery.ts';
import { showCommentsQuery } from '$lib/requests/queries/shows/showCommentsQuery.ts';
import { showSentimentsQuery } from '$lib/requests/queries/shows/showSentimentsQuery.ts';
import type {
  EpisodeCommentProps,
  MediaCommentProps,
} from '$lib/sections/summary/components/comments/CommentsProps.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived, readable } from 'svelte/store';
import { mergeComments } from './mergeComments.ts';

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

function typeToSentimentsQuery(props: UseCommentsProps) {
  const { slug } = props;

  switch (props.type) {
    case 'movie':
      return movieSentimentsQuery({ slug });
    // FIXME use episode specific sentiments when API is fixed
    case 'episode':
    case 'show':
      return showSentimentsQuery({ slug });
  }
}

export function useComments(props: UseCommentsProps) {
  const comments = useQuery(typeToCommentsQuery(props));
  const sentiments = props.type === 'episode'
    ? readable({ data: undefined, isPending: false })
    : useQuery(typeToSentimentsQuery(props));

  const queries = [
    comments,
    sentiments,
  ];

  const isLoading = derived(
    queries,
    ($queries) => $queries.some((query) => query.isPending),
  );

  const list = derived(comments, ($comments) => $comments.data ?? []);
  // const { list, set } = dailyOrderArray<MediaComment>(
  //   `comment-${props.sort}-order`,
  //   (comment) => comment.id,
  // );

  // onMount(() => unstable.subscribe(set));

  return {
    isLoading,
    comments: derived(
      [list, sentiments],
      ([$list, $sentiments]) => mergeComments($list, $sentiments.data),
    ),
  };
}
