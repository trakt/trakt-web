import type { ListedMovieResponse, ListedShowResponse } from '$lib/api.ts';
import { mapMovieResponseToMovieSummary } from '$lib/requests/_internal/mapMovieResponseToMovieSummary.ts';
import { mapShowResponseToEpisodeCount } from '$lib/requests/_internal/mapShowResponseToEpisodeCount.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';

function mapListDetails(
  listedItem: ListedMovieResponse | ListedShowResponse,
) {
  return {
    id: listedItem.id,
    rank: listedItem.rank,
    notes: listedItem.notes,
    type: listedItem.type,
    listedAt: new Date(listedItem.listed_at),
  };
}

export function mapListedShowResponseToListItem(
  listedShowResponse: ListedShowResponse,
) {
  return {
    ...mapListDetails(listedShowResponse),
    entry: {
      ...mapShowResponseToShowSummary(listedShowResponse.show),
      ...mapShowResponseToEpisodeCount(listedShowResponse.show),
    },
  };
}

export function mapListedMovieResponseToListItem(
  listedMovieResponse: ListedMovieResponse,
) {
  return {
    ...mapListDetails(listedMovieResponse),
    entry: mapMovieResponseToMovieSummary(listedMovieResponse.movie),
  };
}
