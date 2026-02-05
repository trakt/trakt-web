import type { CollectionResponse } from '@trakt/api';
import { mapToEpisodeEntry } from '../../../_internal/mapToEpisodeEntry.ts';
import { mapToMovieEntry } from '../../../_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '../../../_internal/mapToShowEntry.ts';
import type { LibraryItem } from '../../../models/LibraryItem.ts';

export function mapToLibraryItem(item: CollectionResponse): LibraryItem {
  if (item.type === 'show') {
    throw new Error('Shows are not supported in libraryQuery.');
  }

  const common = {
    availableOn: (item.available_on ?? []).map((service) => service.name),
    addedAt: new Date(item.collected_at),
  };

  switch (item.type) {
    case 'movie':
      return {
        ...common,
        type: item.type,
        media: mapToMovieEntry(item.movie),
        key: `movie-${item.movie.ids.trakt}`,
      };
    case 'episode':
      return {
        ...common,
        type: item.type,
        media: mapToShowEntry(item.show),
        episode: mapToEpisodeEntry(item.episode),
        key: `episode-${item.episode.ids.trakt}`,
      };
  }
}
