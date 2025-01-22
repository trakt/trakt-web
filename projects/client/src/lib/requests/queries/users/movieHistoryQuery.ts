import type { HistoryMoviesResponse } from '$lib/api.ts';
import { mapMovieResponseToMovieSummary } from '$lib/requests/_internal/mapMovieResponseToMovieSummary.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import type { MovieEntry } from '../../models/MovieEntry.ts';

type MovieHistoryParams = {
  startDate: Date;
  endDate: Date;
  limit: number;
} & ApiParams;

export type HistoryMovie = {
  id: number;
  watchedAt: Date;
  movie: MovieEntry;
};

export function mapResponseToHistory(
  historyMovie: HistoryMoviesResponse,
): HistoryMovie {
  return {
    id: historyMovie.id,
    watchedAt: new Date(historyMovie.watched_at),
    movie: mapMovieResponseToMovieSummary(historyMovie.movie),
  };
}

function movieHistoryRequest(
  { fetch, startDate, endDate, limit }: MovieHistoryParams,
): Promise<HistoryMovie[]> {
  return api({ fetch })
    .users
    .history
    .movies({
      params: {
        id: 'me',
      },
      query: {
        extended: 'full,cloud9',
        start_at: startDate.toISOString(),
        end_at: endDate.toISOString(),
        limit,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch movies history');
      }

      return body.map(mapResponseToHistory);
    });
}

const movieHistoryQueryKey = [
  'movieHistoryQuery',
  InvalidateAction.MarkAsWatched('movie'),
] as const;
export const movieHistoryQuery = (
  params: MovieHistoryParams,
) => ({
  queryKey: movieHistoryQueryKey,
  queryFn: () => movieHistoryRequest(params),
});
