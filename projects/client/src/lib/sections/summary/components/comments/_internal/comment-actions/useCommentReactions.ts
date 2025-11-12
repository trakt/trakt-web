import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import {
  commentReactionsQuery,
  type Reaction,
} from '$lib/requests/queries/comments/commentReactionsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived, type Readable } from 'svelte/store';
import type { ReactionDistribution } from '../models/ReactionDistribution.ts';
import type { ReactionSummary } from '../models/ReactionSummary.ts';

type UseCommentReactionsProps = {
  id: number;
};

const PREVIEW_LIMIT = 3;

type CommentReactions = {
  currentReaction: Readable<Reaction | null>;
  summary: Readable<ReactionSummary>;
  isLoading: Readable<boolean>;
};

export function useCommentReactions(
  { id }: UseCommentReactionsProps,
): CommentReactions {
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
          top: [],
          distribution: {} as ReactionDistribution,
        };
      }

      const sortedDistribution = Object
        .entries($summary.data.distribution)
        .toSorted(([_key, a], [_key2, b]) => b - a);

      const top = sortedDistribution
        .slice(0, PREVIEW_LIMIT)
        .filter(([_, count]) => count > 0)
        .map(([reaction]) => reaction) as Array<Reaction>;

      return {
        count: $summary.data.count,
        distribution: Object.fromEntries(
          sortedDistribution,
        ) as ReactionDistribution,
        top,
      };
    }),
    isLoading: derived(summary, toLoadingState),
  };
}
