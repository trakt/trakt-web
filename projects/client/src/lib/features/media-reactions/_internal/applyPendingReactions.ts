import {
  type MediaReaction,
  MediaReactionSchema,
} from '$lib/requests/models/MediaReaction.ts';
import { toTopReactions } from '$lib/utils/reactions/toTopReactions.ts';
import type { PendingReaction } from './PendingReaction.ts';
import type { PendingReactions } from './PendingReactions.ts';
import type { ReactionsSnapshot } from './ReactionsSnapshot.ts';

type ApplyPendingReactionsParams = ReactionsSnapshot & {
  pending: PendingReactions;
};

const toEntries = (pending: PendingReactions) =>
  Object.entries(pending) as ReadonlyArray<[MediaReaction, PendingReaction]>;

export function applyPendingReactions(
  { held, distribution, totalCount, pending }: ApplyPendingReactionsParams,
) {
  const entries = toEntries(pending);
  const presenceOf = (reaction: MediaReaction) =>
    pending[reaction]?.isPresent ?? held.includes(reaction);
  const deltaOf = (reaction: MediaReaction) =>
    Number(presenceOf(reaction)) - Number(held.includes(reaction));

  const adjusted = Object.fromEntries(
    MediaReactionSchema.options.map((reaction) => [
      reaction,
      Math.max(0, (distribution[reaction] ?? 0) + deltaOf(reaction)),
    ]),
  ) as Record<MediaReaction, number>;

  const totalDelta = entries.reduce(
    (sum, [reaction]) => sum + deltaOf(reaction),
    0,
  );

  return {
    chosen: [
      ...held.filter(presenceOf),
      ...entries
        .filter(([reaction, entry]) =>
          entry.isPresent && !held.includes(reaction)
        )
        .map(([reaction]) => reaction),
    ],
    locked: entries
      .filter(([, entry]) => !entry.isSettled)
      .map(([reaction]) => reaction),
    distribution: adjusted,
    totalCount: Math.max(0, totalCount + totalDelta),
    top: toTopReactions({
      distribution: adjusted,
      reactions: MediaReactionSchema.options,
    }),
  };
}
