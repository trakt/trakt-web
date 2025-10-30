import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { coalesceEpisodes } from '$lib/requests/_internal/coalesceEpisodes.ts';
import { mapToEpisodeEntry } from '$lib/requests/_internal/mapToEpisodeEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';
import {
  UpcomingEpisodeEntrySchema,
  upcomingEpisodesRequest,
} from './upcomingEpisodesQuery.ts';
import { upcomingMoviesRequest } from './upcomingMoviesQuery.ts';

export type CalendarMediaParams = {
  startDate: string;
  days: number;
} & ApiParams;

const UpcomingMediaSchema = z.union([
  UpcomingEpisodeEntrySchema,
  MovieEntrySchema,
]);

export const upcomingMediaQuery = defineQuery({
  key: 'upcomingMedia',
  invalidations: [
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Drop('show'),
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
  ],
  dependencies: (
    params: CalendarMediaParams,
  ) => [params.startDate, params.days],
  request: (params) =>
    Promise.all([
      upcomingEpisodesRequest(params),
      upcomingMoviesRequest(params),
    ]),
  mapper: ([episodesResponse, moviesResponse]) => {
    const allEpisodes = episodesResponse.body.map((item) => ({
      show: mapToShowEntry(item.show),
      ...mapToEpisodeEntry(item.episode),
    }));
    const episodes = coalesceEpisodes(allEpisodes);

    const movies = moviesResponse.body.map((entry) =>
      mapToMovieEntry(entry.movie)
    );

    return [...episodes, ...movies]
      .sort((a, b) => {
        return new Date(a.airDate).getTime() - new Date(b.airDate).getTime();
      });
  },
  schema: UpcomingMediaSchema.array(),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
