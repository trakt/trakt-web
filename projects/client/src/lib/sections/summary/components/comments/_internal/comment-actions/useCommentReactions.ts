import { useUser } from '$lib/features/auth/stores/useUser.ts';
import {
  type Reaction,
} from '$lib/requests/queries/comments/commentReactionsQuery.ts';
import { derived, type Readable } from 'svelte/store';
import type { MediaComment } from '../../../../../../requests/models/MediaComment.ts';
import type { ReactionDistribution } from '../models/ReactionDistribution.ts';
import type { ReactionSummary } from '../models/ReactionSummary.ts';

type UseCommentReactionsProps = {
  comment: MediaComment;
};

const PREVIEW_LIMIT = 3;

type CommentReactions = {
  currentReaction: Readable<Reaction | null>;
  summary: ReactionSummary;
};

function mapToSummary(comment: MediaComment): ReactionSummary {
  if (!comment.reactions) {
    return {
      count: 0,
      top: [],
      distribution: {} as ReactionDistribution,
    };
  }

  const sortedDistribution = Object
    .entries(comment.reactions.distribution)
    .toSorted(([_key, a], [_key2, b]) => b - a);

  const top = sortedDistribution
    .slice(0, PREVIEW_LIMIT)
    .filter(([_, count]) => count > 0)
    .map(([reaction]) => reaction) as Array<Reaction>;

  return {
    count: comment.reactions.count,
    distribution: Object.fromEntries(
      sortedDistribution,
    ) as ReactionDistribution,
    top,
  };
}

export function useCommentReactions(
  { comment }: UseCommentReactionsProps,
): CommentReactions {
  const { reactions } = useUser();

  return {
    currentReaction: derived(reactions, ($reactions) => {
      return $reactions?.get(comment.id)?.reaction ?? null;
    }),
    summary: mapToSummary(comment),
  };
}
