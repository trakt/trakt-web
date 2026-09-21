import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { ReactionTarget } from '$lib/requests/models/ReactionTarget.ts';
import { mediaReactionsSummaryQuery } from '$lib/requests/queries/reactions/mediaReactionsSummaryQuery.ts';
import { reactMediaRequest } from '$lib/requests/queries/reactions/reactMediaRequest.ts';
import { removeMediaReactionRequest } from '$lib/requests/queries/reactions/removeMediaReactionRequest.ts';
import {
  type UserMediaReaction,
  userMediaReactionsQuery,
} from '$lib/requests/queries/reactions/userMediaReactionsQuery.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { useRecentReactions } from '$lib/stores/useRecentReactions.ts';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  type Observable,
  startWith,
} from 'rxjs';
import {
  MEDIA_REACTIONS_CODE_MAP,
  type MediaReactionType,
} from './_internal/MEDIA_REACTIONS_CODE_MAP.ts';

export const MAX_MEDIA_REACTIONS = 3;
const PREVIEW_LIMIT = 3;

export type MediaReaction = {
  type: MediaReactionType;
  code: string;
  count: number;
};

const DECLARED_ORDER = Object.keys(
  MEDIA_REACTIONS_CODE_MAP,
) as MediaReactionType[];

/** Every known reaction with its count, busiest first, ties in declared order. */
function toReactions(distribution: Record<string, number>): MediaReaction[] {
  return DECLARED_ORDER
    .map((type) => ({
      type,
      code: MEDIA_REACTIONS_CODE_MAP[type],
      count: distribution[type] ?? 0,
    }))
    .toSorted((left, right) => right.count - left.count);
}

export function useMediaReactions(target$: Observable<ReactionTarget>) {
  const version = new BehaviorSubject(0);
  const isReacting = new BehaviorSubject(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.React);
  const { recent, push } = useRecentReactions();

  const summary = useQuery(
    combineLatest([target$, version]).pipe(
      map(([target, $version]) =>
        mediaReactionsSummaryQuery({ target, version: $version })
      ),
    ),
  );
  const mine = useQuery(
    target$.pipe(map((target) => userMediaReactionsQuery({ target }))),
  );

  // A write bumps `version`, which makes the summary a new query with no data
  // while it loads. Holding the last response keeps the picker from
  // collapsing to all zeros in between.
  const loaded = summary.pipe(
    map(($summary) => $summary.data),
    filter((data) => data != null),
    startWith({ count: 0, distribution: {} }),
  );

  const reactions = loaded.pipe(
    map(($loaded) => toReactions($loaded.distribution)),
  );

  const refresh = async () => {
    await invalidate(InvalidateAction.ReactMedia);
    version.next(version.getValue() + 1);
  };

  const react = async ({ target, type }: {
    target: ReactionTarget;
    type: string;
  }) => {
    isReacting.next(true);
    track({ action: 'add', type: target.type });

    try {
      const isReacted = await reactMediaRequest({ target, type });
      if (!isReacted) return;

      push(type);
      await refresh();
    } finally {
      isReacting.next(false);
    }
  };

  const remove = async ({ target, id }: {
    target: ReactionTarget;
    id: number;
  }) => {
    isReacting.next(true);
    track({ action: 'remove', type: target.type });

    try {
      const isRemoved = await removeMediaReactionRequest({ target, id });
      if (!isRemoved) return;

      await refresh();
    } finally {
      isReacting.next(false);
    }
  };

  return {
    count: loaded.pipe(map(($loaded) => $loaded.count)),
    top: reactions.pipe(
      map(($reactions) =>
        $reactions.filter((reaction) => reaction.count > 0).slice(
          0,
          PREVIEW_LIMIT,
        )
      ),
    ),
    reactions,
    mine: mine.pipe(
      map(($mine): UserMediaReaction[] => $mine.data ?? []),
    ),
    recent: combineLatest([recent, reactions]).pipe(
      map(([$recent, $reactions]) => {
        const byType = new Map<string, MediaReaction>(
          $reactions.map((reaction) => [reaction.type, reaction]),
        );
        return $recent.flatMap((type) => byType.get(type) ?? []);
      }),
    ),
    isReacting,
    react,
    remove,
  };
}
