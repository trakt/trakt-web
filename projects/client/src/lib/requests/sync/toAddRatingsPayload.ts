import type { RatingsSyncRequest } from '@trakt/api';

type RatingMediaType = 'movie' | 'show' | 'episode';

export type RatedTarget = {
  id: number;
  rating: number;
};

// Builds the sync/ratings body for a set of rated trakt ids of a single media
// type. The computed `${type}s` key can't be verified against the union, hence
// the cast at the boundary.
export function toAddRatingsPayload(
  type: RatingMediaType,
  targets: ReadonlyArray<RatedTarget>,
): RatingsSyncRequest {
  return {
    [`${type}s`]: targets.map(({ id, rating }) => ({
      ids: { trakt: id },
      rating,
    })),
  } as RatingsSyncRequest;
}
