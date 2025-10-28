import { commentRepliesQuery } from '$lib/requests/queries/comments/commentRepliesQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';

// FIXME: use infinite query
const REPLY_LIMIT = 500;

type UseCommentRepliesParams = {
  id: number;
};

export function useCommentReplies({ id }: UseCommentRepliesParams) {
  const query = commentRepliesQuery({ id, page: 1, limit: REPLY_LIMIT });

  return usePaginatedListQuery(query);
}
