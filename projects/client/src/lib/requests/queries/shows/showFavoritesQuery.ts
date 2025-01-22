import type { FavoritedShowsResponse } from '$lib/api.ts';
import { api, type ApiParams } from '$lib/requests/_internal/api';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import type { FavoritedMedia } from '$lib/requests/models/FavoritedMedia.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';

function mapFavoritedShowResponse(
  entry: FavoritedShowsResponse,
): FavoritedMedia {
  return {
    id: entry.show.ids.trakt,
    favoritedAt: new Date(entry.listed_at),
    item: mapShowResponseToShowSummary(entry.show),
  };
}

const favoritedShowsRequest = (
  { fetch }: ApiParams,
): Promise<FavoritedMedia[]> =>
  api({ fetch })
    .users
    .favorites
    .shows({
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
        throw new Error('Error fetching user favorited shows.');
      }

      return response.body.map(mapFavoritedShowResponse);
    });

export const showFavoritesQueryKey = [
  'showFavorites',
  InvalidateAction.Favorited('show'),
] as const;
export const showFavoritesQuery = ({ fetch }: ApiParams = {}) => ({
  queryKey: showFavoritesQueryKey,
  queryFn: () => favoritedShowsRequest({ fetch }),
});
