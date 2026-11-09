import { browser } from '$app/environment';
import { currentUserRatingsQuery } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';

export function useFreshRatings() {
  const client = browser ? useQueryClient() : undefined;
  const { queryKey } = currentUserRatingsQuery();

  const loadedAt = Date.now();
  let refreshedFor = 0;

  const hasCheckedRatingsSince = (date: Date) => {
    const state = client?.getQueryState(queryKey);

    if (state == null) {
      return false;
    }

    const checkpoint = Math.max(date.getTime(), loadedAt);

    if (state.dataUpdatedAt >= checkpoint) {
      return true;
    }

    if (state.fetchStatus !== 'idle') {
      return false;
    }

    if (refreshedFor >= checkpoint) {
      return true;
    }

    refreshedFor = checkpoint;
    client?.invalidateQueries({ queryKey });

    return false;
  };

  return {
    hasCheckedRatingsSince,
  };
}
