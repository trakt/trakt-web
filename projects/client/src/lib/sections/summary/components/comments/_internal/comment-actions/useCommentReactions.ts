import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import {
  commentReactionsQuery,
  type Reaction,
} from '$lib/requests/queries/comments/commentReactionsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map, type Observable } from 'rxjs';
import type { ReactionDistribution } from '../models/ReactionDistribution.ts';
import type { ReactionSummary } from '../models/ReactionSummary.ts';

type UseCommentReactionsProps = {
  id: number;
};

const PREVIEW_LIMIT = 3;

type CommentReactions = {
  currentReaction: Observable<Reaction | null>;
  summary: Observable<ReactionSummary>;
  isLoading: Observable<boolean>;
};

export function useCommentReactions(
  { id }: UseCommentReactionsProps,
): CommentReactions {
  const { reactions } = useUser();

  const summary = useQuery(commentReactionsQuery({ id }));

  return {
    currentReaction: reactions.pipe(
      map(($reactions) => {
        return $reactions?.get(id)?.reaction ?? null;
      }),
    ),
    summary: summary.pipe(
      map(($summary) => {
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
    ),
    isLoading: summary.pipe(map(toLoadingState)),
  };
}
