import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import { commentQuery } from '$lib/requests/queries/comments/commentQuery.ts';
import type { PaginatableStore } from '$lib/sections/lists/drilldown/PaginatableStore.ts';

import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map, of } from 'rxjs';

type UseSingleReviewParams = {
  commentId: number;
};

export function useSingleReview(
  { commentId }: UseSingleReviewParams,
): PaginatableStore<MediaComment, string> {
  return () => {
    const query = useQuery(commentQuery({ id: commentId }));

    const list = query.pipe(
      map(($query) => ($query.data != null ? [$query.data] : [])),
    );

    const isLoading = query.pipe(map(toLoadingState));

    return {
      list,
      isLoading,
      hasNextPage: of(false),
      fetchNextPage: () => Promise.resolve(),
    };
  };
}
