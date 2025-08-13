import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import {
  commentReactionsQuery,
  type Reaction,
} from '$lib/requests/queries/comments/commentReactionsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';

type UseCommentReactionsProps = {
  id: number;
};

const PREVIEW_LIMIT = 3;

export function useCommentReactions({ id }: UseCommentReactionsProps) {
  const { reactions } = useUser();

  const summary = useQuery(commentReactionsQuery({ id }));

  return {
    currentReaction: derived(reactions, ($reactions) => {
      return $reactions?.get(id)?.reaction ?? null;
    }),
    summary: derived(summary, ($summary) => {
      if (!$summary.data) {
        return {
          count: 0,
          topCount: 0,
          top: [],
          distribution: {},
        };
      }

      const sortedDistribution = Object
        .entries($summary.data.distribution)
        .sort(([_key, a], [_key2, b]) => b - a) as Array<[Reaction, number]>;

      const top = sortedDistribution
        .slice(0, PREVIEW_LIMIT)
        .filter(([_, count]) => count > 0);

      return {
        count: $summary.data.count,
        distribution: Object.fromEntries(sortedDistribution),
        top,
        topCount: top.reduce((sum, [_, count]) => sum + count, 0),
      };
    }),
    isLoading: derived(summary, toLoadingState),
  };
}
