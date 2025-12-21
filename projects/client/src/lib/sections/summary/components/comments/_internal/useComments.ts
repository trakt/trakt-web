import type { CommentSortType } from '$lib/requests/models/CommentSortType.ts';
import { episodeCommentsQuery } from '$lib/requests/queries/episode/episodeCommentsQuery.ts';
import { movieCommentsQuery } from '$lib/requests/queries/movies/movieCommentsQuery.ts';
import { showCommentsQuery } from '$lib/requests/queries/shows/showCommentsQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import type {
  EpisodeCommentProps,
  MediaCommentProps,
} from '$lib/sections/summary/components/comments/CommentsProps.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';

type UseCommentsProps = {
  slug: string;
  limit?: number;
  sort: CommentSortType;
} & (MediaCommentProps | EpisodeCommentProps);

function typeToCommentsQuery(props: UseCommentsProps) {
  const commonProps = {
    slug: props.slug,
    limit: props.limit ?? DEFAULT_PAGE_SIZE,
    sort: props.sort,
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
