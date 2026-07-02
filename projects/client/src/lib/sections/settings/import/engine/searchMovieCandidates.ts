import { api } from '$lib/requests/api.ts';
import type { ImportIds } from '../ImportTypes.ts';

export type MovieCandidate = {
  ids: ImportIds;
  year?: number;
};

export async function searchMovieCandidates(
  title: string,
): Promise<MovieCandidate[]> {
  const response = await api()
    .search
    .exact({
      params: { type: 'movie' },
      query: { query: title, limit: 5 },
    });

  if (response.status !== 200) return [];

  return response.body.flatMap((result) => {
    if (result.type !== 'movie' || !result.movie) return [];

    const { ids, year } = result.movie;
    return [{
      ids: {
        trakt: ids.trakt,
        imdb: ids.imdb ?? undefined,
        tmdb: ids.tmdb ?? undefined,
      },
      year: year ?? undefined,
    }];
  });
}
