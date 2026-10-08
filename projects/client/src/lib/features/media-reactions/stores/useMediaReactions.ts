import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaReactionSummary } from '$lib/requests/models/MediaReactionSummary.ts';
import { mediaReactionsSummaryQuery } from '$lib/requests/queries/media/mediaReactionsSummaryQuery.ts';
import { userMediaReactionsQuery } from '$lib/requests/queries/users/userMediaReactionsQuery.ts';
import type { UserMediaReaction } from '$lib/requests/models/UserMediaReaction.ts';
import { toMediaReactionDistribution } from '$lib/utils/reactions/toMediaReactionDistribution.ts';
import { map, type Observable } from 'rxjs';
import type { MediaReactionsTarget } from '$lib/features/media-reactions/MediaReactionsTarget.ts';

type UseMediaReactionsProps = {
  target$: Observable<MediaReactionsTarget>;
};

type MediaReactions = {
  summary: Observable<MediaReactionSummary>;
  held: Observable<ReadonlyArray<UserMediaReaction>>;
  isLoading: Observable<boolean>;
};

const EMPTY_SUMMARY: MediaReactionSummary = {
  totalCount: 0,
  distribution: toMediaReactionDistribution({}),
  top: [],
};

export function useMediaReactions(
  { target$ }: UseMediaReactionsProps,
): MediaReactions {
  const summary = useQuery(
    target$.pipe(
      map(({ type, slug }) => mediaReactionsSummaryQuery({ type, slug })),
    ),
  );
  const mine = useQuery(
    target$.pipe(map(({ type, id }) => userMediaReactionsQuery({ type, id }))),
  );

  return {
    summary: summary.pipe(map(($summary) => $summary.data ?? EMPTY_SUMMARY)),
    held: mine.pipe(map(($mine) => $mine.data ?? [])),
    isLoading: summary.pipe(
      map(($summary) => $summary.isEnabled && $summary.isPending),
    ),
  };
}
