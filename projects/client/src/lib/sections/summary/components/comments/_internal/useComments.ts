import type { CommentSortType } from '$lib/requests/models/CommentSortType.ts';
import { episodeCommentsQuery } from '$lib/requests/queries/episode/episodeCommentsQuery.ts';
import { movieCommentsQuery } from '$lib/requests/queries/movies/movieCommentsQuery.ts';
import { showCommentsQuery } from '$lib/requests/queries/shows/showCommentsQuery.ts';
import type {
  EpisodeCommentProps,
  MediaCommentProps,
} from '$lib/sections/summary/components/comments/CommentsProps.ts';
import { usePaginatedListQuery } from '../../../../lists/stores/usePaginatedListQuery.ts';

const COMMENT_LIMIT = 10;

type UseCommentsProps = {
  slug: string;
  limit?: number;
  page?: number;
  sort: CommentSortType;
} & (MediaCommentProps | EpisodeCommentProps);

function typeToCommentsQuery(props: UseCommentsProps) {
  const commonProps = {
    slug: props.slug,
    limit: props.limit ?? COMMENT_LIMIT,
    sort: props.sort,
    page: props.page ?? 1,
  };

  switch (props.type) {
    case 'movie':
      return movieCommentsQuery(commonProps);
    case 'show':
      return showCommentsQuery(commonProps);
    case 'episode':
      return episodeCommentsQuery({
        ...commonProps,
        season: props.season,
        episode: props.episode,
      });
  }
}

export function useComments(props: UseCommentsProps) {
  return usePaginatedListQuery(typeToCommentsQuery(props));
}
