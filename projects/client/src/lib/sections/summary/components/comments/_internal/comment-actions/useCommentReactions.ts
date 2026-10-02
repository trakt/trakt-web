import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import {
  commentReactionsQuery,
  type Reaction,
} from '$lib/requests/queries/comments/commentReactionsQuery.ts';
import { toTopReactions } from '$lib/utils/reactions/toTopReactions.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { reactionsSchema } from '@trakt/api';
import { map, type Observable } from 'rxjs';
import type { ReactionSummary } from '../models/ReactionSummary.ts';

type UseCommentReactionsProps = {
  id: number;
};

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
            distribution: {},
          };
        }

        const top = toTopReactions({
          distribution: $summary.data.distribution,
          reactions: reactionsSchema.options,
        });

        return {
          count: $summary.data.count,
          distribution: $summary.data.distribution,
          top,
        };
      }),
    ),
    isLoading: summary.pipe(map(toLoadingState)),
  };
}
