import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import {
  type ListedShowResponse,
  type UpNextIntentRequest,
  type UpNextResponse,
} from '@trakt/api';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { mapToEpisodeEntry } from '../../_internal/mapToEpisodeEntry.ts';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import { mapToShowProgress } from '../../_internal/mapToShowProgress.ts';
import type { FilterParams } from '../../models/FilterParams.ts';
import {
  type UpNextEntry,
  UpNextEntryNitroSchema,
} from '../../models/UpNextEntry.ts';

type UpNextParams =
  & PaginationParams
  & ApiParams
  & UpNextIntentRequest
  & FilterParams;

function mapUpNextContinueWatching(item: UpNextResponse): UpNextEntry {
  const show = mapToShowEntry(item.show);
  const episode = mapToEpisodeEntry(item.progress.next_episode);
  episode.runtime = isNaN(episode.runtime) ? show.runtime : episode.runtime;

  const progress = mapToShowProgress(item.progress);

  return {
    intent: 'continue',
    show,
    ...episode,
    ...progress,
  };
}

function mapUpNextStartWatching(response: ListedShowResponse): UpNextEntry {
  const show = mapToShowEntry(response.show);

  return {
    intent: 'start',
    ...show,
    episode: {
      ...show.episode,
      season: 1,
      number: 1,
    },
  };
}

export function mapUpNextResponse(
  response: UpNextResponse | ListedShowResponse,
) {
  return 'listed_at' in response
    ? mapUpNextStartWatching(response)
    : mapUpNextContinueWatching(response);
}

export type UpNextSuccessResponse = {
  status: 200;
  body: UpNextResponse[] | ListedShowResponse[];
  headers: Headers;
};

export type UpNextResponseType = UpNextSuccessResponse | {
  status: number;
  body: unknown;
  headers: Headers;
};

export const upNextNitroRequest = (
  params: UpNextParams,
): Promise<UpNextResponseType> => {
  const { fetch, limit, page, intent, filter } = params;

  if (intent === 'start') {
    return api({ fetch })
      .users
      .watchlist
      .shows({
        params: {
          id: 'me',
          sort: 'released',
        },
        query: {
          extended: 'full,images,colors',
          // FIXME: update @trakt/api to allow comma separated values
          hide: 'unreleased,watched,watching' as 'unreleased',
          sort_how: 'desc',
          page,
          limit,
          ...filter,
        },
      });
  }

  return api({ fetch })
    .sync
    .progress
    .upNext
    .nitro({
      query: {
        page,
        limit,
        intent,
        ...filter,
      },
    });
};

export const upNextNitroQuery = defineInfiniteQuery({
  key: 'upNext',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Drop('show'),
    InvalidateAction.Restore,
    InvalidateAction.Watchlisted('show'),
  ],
  dependencies: (
    params: UpNextParams,
  ) => [
    params.page,
    params.limit,
    params.intent,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: upNextNitroRequest,
  mapper: (queryResponse) => {
    const response = queryResponse as UpNextSuccessResponse;

    return {
      entries: response.body.map(mapUpNextResponse),
      page: extractPageMeta(response.headers),
    };
  },
  schema: PaginatableSchemaFactory(UpNextEntryNitroSchema),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
