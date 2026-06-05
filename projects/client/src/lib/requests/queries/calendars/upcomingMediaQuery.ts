import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { coalesceEpisodes } from '$lib/requests/_internal/coalesceEpisodes.ts';
import { mapToUpcomingEpisodeEntry } from '$lib/requests/_internal/mapToUpcomingEpisodeEntry.ts';
import { type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { mapToMovieEntry } from '../../_internal/mapToMovieEntry.ts';
import type { FilterParams } from '../../models/FilterParams.ts';
import { MovieEntrySchema } from '../../models/MovieEntry.ts';
import {
  UpcomingEpisodeEntrySchema,
  upcomingEpisodesRequest,
} from './upcomingEpisodesQuery.ts';
import { upcomingMoviesRequest } from './upcomingMoviesQuery.ts';

export type CalendarMediaParams =
  & {
    startDate: string;
    days: number;
    target?: 'my' | 'all';
  }
  & ApiParams
  & FilterParams;

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
  ) => [
    params.target,
    params.startDate,
    params.days,
    ...getGlobalFilterDependencies(
      params.filterOverride?.movie ?? params.filter,
    ),
    ...getGlobalFilterDependencies(
      params.filterOverride?.show ?? params.filter,
    ),
  ],
  request: (params) =>
    Promise.all([
      upcomingEpisodesRequest(params),
      upcomingMoviesRequest(params),
    ]),
  mapper: ([episodesResponse, moviesResponse]) => {
    const episodes = coalesceEpisodes(
      episodesResponse.body.map(mapToUpcomingEpisodeEntry),
    );

    const movies = moviesResponse.body.map((entry) =>
      mapToMovieEntry(entry.movie)
    );

    return [...episodes, ...movies]
      .toSorted((a, b) =>
        a.effectiveReleaseDate.getTime() - b.effectiveReleaseDate.getTime()
      );
  },
  schema: UpcomingMediaSchema.array(),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
