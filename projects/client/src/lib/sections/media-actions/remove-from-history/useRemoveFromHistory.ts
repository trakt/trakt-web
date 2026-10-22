import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { episodeActivityHistoryRequest } from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
import { movieActivityHistoryRequest } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import { removeRatingRequest } from '$lib/requests/sync/removeRatingRequest.ts';
import { removeWatchedRequest } from '$lib/requests/sync/removeWatchedRequest.ts';
import { toRemoveRatingsPayload } from '$lib/requests/sync/toRemoveRatingsPayload.ts';
import { resolve } from '$lib/utils/store/resolve.ts';

type OrphanedRating = number | undefined;

export type UseRemoveFromHistoryProps =
  | { type: 'movie'; id: number; movie: { id: number } }
  | {
      type: 'episode';
      id: number;
      episode: { id: number };
      show: { id: number };
    };

export function useRemoveFromHistory(props: UseRemoveFromHistoryProps) {
  const { id, type } = props;
  // Trakt id of the media itself; `id` above is the history entry (play) id.
  const traktId = props.type === 'movie' ? props.movie.id : props.episode.id;

  const { ratings } = useUser();
  const { track } = useTrack(AnalyticsEvent.RemoveFromHistory);

  const fetchPlays = async (): Promise<number | undefined> => {
    const params = { slug: 'me', id: traktId, limit: 2 };
    const response =
      props.type === 'movie'
        ? await movieActivityHistoryRequest(params)
        : await episodeActivityHistoryRequest(params);

    return response.status === 200 ? response.body.length : undefined;
  };

  const getOrphanedRating = async (): Promise<number | undefined> => {
    const [plays, currentRatings] = await Promise.all([
      fetchPlays().catch(() => undefined),
      resolve(ratings),
    ]);

    if (plays !== 1 || !currentRatings) {
      return undefined;
    }

    const rated =
      props.type === 'movie' ? currentRatings.movies : currentRatings.episodes;

    return rated.get(traktId)?.rating;
  };

  const historyInvalidations = (orphanedRating: OrphanedRating) =>
    orphanedRating == null
      ? [InvalidateAction.MarkAsWatched(type)]
      : [InvalidateAction.Rated(type), InvalidateAction.MarkAsWatched(type)];

  const removal = useMutation(
    defineMutation({
      key: 'history:remove',
      request: async (): Promise<OrphanedRating> => {
        const orphanedRating = await getOrphanedRating();

        await removeWatchedRequest({ body: { ids: [id] } });

        if (orphanedRating != null) {
          await removeRatingRequest({
            body: toRemoveRatingsPayload(type, [traktId]),
          });
        }

        return orphanedRating;
      },
      invalidations: ({ data }) => historyInvalidations(data),
    }),
  );

  const removeFromHistory = async () => {
    track();

    await removal.mutate();
  };

  return {
    isRemoving: removal.isPending,
    removeFromHistory,
  };
}
