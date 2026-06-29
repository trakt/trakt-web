import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { coalesceEpisodes } from '$lib/requests/_internal/coalesceEpisodes.ts';
import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToUpcomingEpisodeEntry } from '$lib/requests/_internal/mapToUpcomingEpisodeEntry.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { movieAnticipatedRequest } from '$lib/requests/queries/movies/movieAnticipatedQuery.ts';
import { movieTrendingRequest } from '$lib/requests/queries/movies/movieTrendingQuery.ts';
import { recommendedMoviesRequest } from '$lib/requests/queries/recommendations/recommendedMoviesQuery.ts';
import { recommendedShowsRequest } from '$lib/requests/queries/recommendations/recommendedShowsQuery.ts';
import { showAnticipatedRequest } from '$lib/requests/queries/shows/showAnticipatedQuery.ts';
import { showTrendingRequest } from '$lib/requests/queries/shows/showTrendingQuery.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { CalendarMovieResponse, CalendarShowResponse } from '@trakt/api';
import { z } from 'zod';
import {
  UpcomingEpisodeEntrySchema,
  upcomingEpisodesRequest,
} from './upcomingEpisodesQuery.ts';
import { upcomingMoviesRequest } from './upcomingMoviesQuery.ts';

type IdContainer = {
  ids: {
    trakt: number;
  };
};

type MovieTopListItem = {
  movie: IdContainer;
};

type ShowTopListItem = {
  show: IdContainer;
};

type TopListResult<T> = {
  lists: ReadonlyArray<ReadonlyArray<T> | Nil>;
  responses: ReadonlyArray<{ status: number }>;
};

type ReleasesCalendarBody = {
  movies: CalendarMovieResponse[];
  episodes: CalendarShowResponse[];
  movieTopLists: ReadonlyArray<ReadonlyArray<MovieTopListItem> | Nil>;
  showTopLists: ReadonlyArray<ReadonlyArray<ShowTopListItem> | Nil>;
};

type ReleasesCalendarResponse = {
  body: ReleasesCalendarBody;
  status: number;
};

export type ReleasesCalendarParams =
  & {
    startDate: string;
    days: number;
    type: DiscoverMode;
    sourceLimit: number;
  }
  & ApiParams
  & FilterParams;

const ReleasesCalendarEntrySchema = z.union([
  UpcomingEpisodeEntrySchema,
  MovieEntrySchema,
]);

export type ReleasesCalendarEntry = z.infer<typeof ReleasesCalendarEntrySchema>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasTraktId(value: unknown): value is IdContainer {
  if (!isRecord(value)) {
    return false;
  }

  const ids = value.ids;
  if (!isRecord(ids)) {
    return false;
  }

  return typeof ids.trakt === 'number';
}

function isMovieTopListItem(item: unknown): item is MovieTopListItem {
  return isRecord(item) && hasTraktId(item.movie);
}

function isShowTopListItem(item: unknown): item is ShowTopListItem {
  return isRecord(item) && hasTraktId(item.show);
}

function isCalendarMovie(item: unknown): item is CalendarMovieResponse {
  return isRecord(item) && isRecord(item.movie);
}

function isCalendarShow(item: unknown): item is CalendarShowResponse {
  return isRecord(item) && isRecord(item.show) && isRecord(item.episode);
}

function toList<T>(
  body: unknown,
  isItem: (item: unknown) => item is T,
): T[] {
  if (!Array.isArray(body)) {
    return [];
  }

  return body.filter(isItem);
}

function idsFromLists<T>(
  lists: ReadonlyArray<ReadonlyArray<T> | Nil>,
  getId: (item: T) => number,
) {
  return new Set(
    lists.flatMap((list) => list?.map(getId) ?? []),
  );
}

function findFailedResponse(
  responses: ReadonlyArray<{ status: number } | Nil>,
) {
  return responses.find((response) =>
    response != null && response.status !== 200
  );
}

async function fetchMovieTopLists(
  {
    fetch,
    filter,
    filterOverride,
    sourceLimit,
  }: ReleasesCalendarParams,
): Promise<TopListResult<MovieTopListItem>> {
  const [trending, recommended, anticipated] = await Promise.all([
    movieTrendingRequest({
      fetch,
      filter,
      filterOverride,
      limit: sourceLimit,
      page: 1,
    }),
    recommendedMoviesRequest({
      fetch,
      filter,
      filterOverride,
      limit: sourceLimit,
    }),
    movieAnticipatedRequest({
      fetch,
      filter,
      filterOverride,
      limit: sourceLimit,
      page: 1,
    }),
  ]);

  return {
    responses: [trending, recommended, anticipated],
    lists: [
      toList(trending.body, isMovieTopListItem),
      toList(recommended.body, isMovieTopListItem),
      toList(anticipated.body, isMovieTopListItem),
    ],
  };
}

async function fetchShowTopLists(
  {
    fetch,
    filter,
    filterOverride,
    sourceLimit,
  }: ReleasesCalendarParams,
): Promise<TopListResult<ShowTopListItem>> {
  const [trending, recommended, anticipated] = await Promise.all([
    showTrendingRequest({
      fetch,
      filter,
      filterOverride,
      limit: sourceLimit,
      page: 1,
    }),
    recommendedShowsRequest({
      fetch,
      filter,
      filterOverride,
      limit: sourceLimit,
    }),
    showAnticipatedRequest({
      fetch,
      filter,
      filterOverride,
      limit: sourceLimit,
      page: 1,
    }),
  ]);

  return {
    responses: [trending, recommended, anticipated],
    lists: [
      toList(trending.body, isShowTopListItem),
      toList(recommended.body, isShowTopListItem),
      toList(anticipated.body, isShowTopListItem),
    ],
  };
}

const emptyTopListResult = <T>(): TopListResult<T> => ({
  lists: [],
  responses: [],
});

const emptyReleasesCalendarBody = (): ReleasesCalendarBody => ({
  movies: [],
  episodes: [],
  movieTopLists: [],
  showTopLists: [],
});

const releasesCalendarRequest = async (
  params: ReleasesCalendarParams,
): Promise<ReleasesCalendarResponse> => {
  const { fetch, startDate, days, type, filter, filterOverride } = params;

  const includeMovies = type !== 'show';
  const includeShows = type !== 'movie';

  const [
    moviesResponse,
    episodesResponse,
    movieTopLists,
    showTopLists,
  ] = await Promise.all([
    includeMovies
      ? upcomingMoviesRequest({
        fetch,
        startDate,
        days,
        filter,
        filterOverride,
        target: 'all',
      })
      : undefined,
    includeShows
      ? upcomingEpisodesRequest({
        fetch,
        startDate,
        days,
        filter,
        filterOverride,
        target: 'all',
      })
      : undefined,
    includeMovies
      ? fetchMovieTopLists(params)
      : emptyTopListResult<MovieTopListItem>(),
    includeShows
      ? fetchShowTopLists(params)
      : emptyTopListResult<ShowTopListItem>(),
  ]);

  const failedResponse = findFailedResponse([
    moviesResponse,
    episodesResponse,
    ...movieTopLists.responses,
    ...showTopLists.responses,
  ]);

  if (failedResponse) {
    return {
      body: emptyReleasesCalendarBody(),
      status: failedResponse.status,
    };
  }

  return {
    body: {
      movies: toList(moviesResponse?.body, isCalendarMovie),
      episodes: toList(episodesResponse?.body, isCalendarShow),
      movieTopLists: movieTopLists.lists,
      showTopLists: showTopLists.lists,
    },
    status: 200,
  };
};

export const releasesCalendarQuery = defineQuery({
  key: 'releasesCalendar',
  invalidations: [
    InvalidateAction.Watchlisted('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.Drop('show'),
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.MarkAsWatched('movie'),
    InvalidateAction.HideRecommended('show'),
    InvalidateAction.HideRecommended('movie'),
  ],
  dependencies: (
    params: ReleasesCalendarParams,
  ) => [
    params.type,
    params.startDate,
    params.days,
    params.sourceLimit,
    ...getGlobalFilterDependencies(
      params.filterOverride?.movie ?? params.filter,
    ),
    ...getGlobalFilterDependencies(
      params.filterOverride?.show ?? params.filter,
    ),
  ],
  request: releasesCalendarRequest,
  mapper: (response) => {
    const movieIds = idsFromLists(
      response.body.movieTopLists,
      (item) => item.movie.ids.trakt,
    );
    const showIds = idsFromLists(
      response.body.showTopLists,
      (item) => item.show.ids.trakt,
    );

    const movies = response.body.movies
      .filter((entry) => movieIds.has(entry.movie.ids.trakt))
      .map((entry) => mapToMovieEntry(entry.movie));

    const episodes = coalesceEpisodes(
      response.body.episodes
        .filter((entry) => showIds.has(entry.show.ids.trakt))
        .map(mapToUpcomingEpisodeEntry),
    );

    return [...episodes, ...movies]
      .toSorted((a, b) =>
        a.effectiveReleaseDate.getTime() - b.effectiveReleaseDate.getTime()
      );
  },
  schema: ReleasesCalendarEntrySchema.array(),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
