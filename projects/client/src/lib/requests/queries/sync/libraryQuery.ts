import type { CollectionResponse } from '@trakt/api';
import z from 'zod';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { time } from '$lib/utils/timing/time.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { mapToEpisodeEntry } from '../../_internal/mapToEpisodeEntry.ts';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import { EpisodeEntrySchema } from '../../models/EpisodeEntry.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';
import { ShowEntrySchema } from '../../models/ShowEntry.ts';

type LibraryParams = ApiParams;

const LibraryItemCommonSchema = z.object({
  addedAt: z.date(),
  availableOn: z.array(z.string()),
  key: z.string(),
});

const LibraryMovieSchema = LibraryItemCommonSchema.extend({
  type: z.literal('movie'),
  media: MovieEntrySchema,
});

const LibraryEpisodeSchema = LibraryItemCommonSchema.extend({
  type: z.literal('episode'),
  media: ShowEntrySchema,
  episode: EpisodeEntrySchema,
});

export const LibraryItemSchema = z.discriminatedUnion('type', [
  LibraryMovieSchema,
  LibraryEpisodeSchema,
]);

export type LibraryItem = z.infer<typeof LibraryItemSchema>;

function mapToLibraryItem(item: CollectionResponse): LibraryItem {
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

const movieLibraryRequest = (
  { fetch }: LibraryParams,
) =>
  api({ fetch })
    .sync
    .collection
    .movies({
      query: {
        extended: 'full,images,available_on',
      },
    });

const episodeLibraryRequest = (
  { fetch }: LibraryParams,
) =>
  api({ fetch })
    .sync
    .collection
    .episodes({
      query: {
        extended: 'full,images,available_on',
      },
    });

export const libraryQuery = defineQuery({
  key: 'libraryQuery',
  invalidations: [],
  dependencies: [],
  request: (params) =>
    Promise.all([
      movieLibraryRequest(params),
      episodeLibraryRequest(params),
    ]),
  mapper: ([movieResponse, episodeResponse]) => {
    const movies = movieResponse.body.map(mapToLibraryItem);
    const episodes = episodeResponse.body.map(mapToLibraryItem);

    return [...movies, ...episodes] as LibraryItem[];
  },
  schema: z.array(LibraryItemSchema),
  ttl: time.hours(3),
  refetchOnWindowFocus: true,
});
