import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import type { ListedAllResponse } from '@trakt/api';
import type { ListItem } from '../models/ListItem.ts';
import { mapToSeason } from '../queries/shows/showSeasonsQuery.ts';
import { mapToEpisodeEntry } from './mapToEpisodeEntry.ts';
import { mapToMovieEntry } from './mapToMovieEntry.ts';
import { mapToShowEntry } from './mapToShowEntry.ts';

function mapListDetails(
  listedItem: ListedAllResponse,
) {
  return {
    id: listedItem.id,
    key: `${listedItem.type}-${listedItem.id}`,
    rank: listedItem.rank,
    notes: listedItem.notes,
    listedAt: new Date(listedItem.listed_at),
  };
}

function mapToListEntry(itemResponse: ListedAllResponse) {
  switch (itemResponse.type) {
    case 'season':
      return {
        type: 'season' as const,
        entry: {
          season: mapToSeason(
            assertDefined(
              itemResponse.season,
              'Expected season in ListedMediaResponse',
            ),
          ),
          show: mapToShowEntry(
            assertDefined(
              itemResponse.show,
              'Expected show in ListedMediaResponse',
            ),
          ),
        },
      };
    case 'episode':
      return {
        type: 'episode' as const,
        entry: {
          episode: mapToEpisodeEntry(
            assertDefined(
              itemResponse.episode,
              'Expected episode in ListedMediaResponse',
            ),
          ),
          show: mapToShowEntry(
            assertDefined(
              itemResponse.show,
              'Expected show in ListedMediaResponse',
            ),
          ),
        },
      };
    case 'movie':
      return {
        type: 'movie' as const,
        entry: mapToMovieEntry(
          assertDefined(
            itemResponse.movie,
            'Expected movie in ListedMediaResponse',
          ),
        ),
      };
    case 'show':
      return {
        type: 'show' as const,
        entry: mapToShowEntry(
          assertDefined(
            itemResponse.show,
            'Expected show in ListedMediaResponse',
          ),
        ),
      };
  }
}

export function mapToListItem(
  itemResponse: ListedAllResponse,
): ListItem {
  return {
    ...mapListDetails(itemResponse),
    ...mapToListEntry(itemResponse),
  };
}
