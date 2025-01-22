import type { FavoritedMoviesResponse } from '$lib/api.ts';
import { api, type ApiParams } from '$lib/requests/_internal/api';
import { mapMovieResponseToMovieSummary } from '$lib/requests/_internal/mapMovieResponseToMovieSummary.ts';
import type { FavoritedMedia } from '$lib/requests/models/FavoritedMedia.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';

function mapFavoritedMovieResponse(
  entry: FavoritedMoviesResponse,
): FavoritedMedia {
  return {
    id: entry.movie.ids.trakt,
    favoritedAt: new Date(entry.listed_at),
    item: mapMovieResponseToMovieSummary(entry.movie),
  };
}

const favoritedMoviesRequest = (
  { fetch }: ApiParams,
): Promise<FavoritedMedia[]> =>
  api({ fetch })
    .users
    .favorites
    .movies({
      params: {
        id: 'me',
        sort: 'rank',
      },
      query: {
        extended: 'full,cloud9',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Error fetching user favorited movies.');
      }

      return response.body.map(mapFavoritedMovieResponse);
    });

export const movieFavoritesQueryKey = [
  'movieFavorites',
  InvalidateAction.Favorited('movie'),
] as const;
export const movieFavoritesQuery = ({ fetch }: ApiParams = {}) => ({
  queryKey: movieFavoritesQueryKey,
  queryFn: () => favoritedMoviesRequest({ fetch }),
});
