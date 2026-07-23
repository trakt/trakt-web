import type { RatingsSyncRequest } from '@trakt/api';

type RatingMediaType = 'movie' | 'show' | 'episode';

export type RatedTarget = {
  id: number;
  rating: number;
};

export function toAddRatingsPayload(
  type: RatingMediaType,
  targets: ReadonlyArray<RatedTarget>,
): RatingsSyncRequest {
  const entries = targets.map(({ id, rating }) => ({
    ids: { trakt: id },
    rating,
  }));

  switch (type) {
    case 'movie':
      return { movies: entries };
    case 'show':
      return { shows: entries };
    case 'episode':
      return { episodes: entries };
  }
}
