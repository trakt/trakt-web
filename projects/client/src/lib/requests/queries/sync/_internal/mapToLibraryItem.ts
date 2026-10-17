import type { CollectionResponse } from '@trakt/api';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { mapToEpisodeEntry } from '$lib/requests/_internal/mapToEpisodeEntry.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import type { LibraryItem } from '$lib/requests/models/LibraryItem.ts';

export function mapToLibraryItem(item: CollectionResponse): LibraryItem {
  if (item.type === 'show') {
    throw new Error('Shows are not supported in libraryQuery.');
  }

  const common = {
    availableOn: (item.available_on ?? []).map((service) => service.name),
    addedAt: new Date(item.collected_at),
  };

  switch (item.type) {
    case 'movie': {
      const movie = assertDefined(
        item.movie,
        'Movie entry is missing in collection item.',
      );

      return {
        ...common,
        type: item.type,
        media: mapToMovieEntry(movie),
        key: `movie-${movie.ids.trakt}`,
      };
    }
    case 'episode': {
      const show = assertDefined(
        item.show,
        'Show entry is missing in collection item.',
      );
      const episode = assertDefined(
        item.episode,
        'Episode entry is missing in collection item.',
      );

      return {
        ...common,
        type: item.type,
        media: mapToShowEntry(show),
        episode: mapToEpisodeEntry(episode),
        key: `episode-${episode.ids.trakt}`,
      };
    }
  }
}
