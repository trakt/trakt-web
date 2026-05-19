import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { UpNextSortBy } from '$lib/sections/lists/progress/UpNextSortBy.ts';
import type { SortDirection } from '$lib/sections/lists/user/models/SortDirection.ts';
import { time } from '$lib/utils/timing/time.ts';
import { type UpNextResponse } from '@trakt/api';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { mapToEpisodeEntry } from '../../_internal/mapToEpisodeEntry.ts';
import { mapToShowEntry } from '../../_internal/mapToShowEntry.ts';
import { mapToShowProgress } from '../../_internal/mapToShowProgress.ts';
import type { FilterParams } from '../../models/FilterParams.ts';
import {
  type UpNextEntry,
  UpNextEntrySchema,
} from '../../models/UpNextEntry.ts';

type UpNextParams =
  & PaginationParams
  & ApiParams
  & FilterParams
  & {
    sortBy?: UpNextSortBy;
    sortHow?: SortDirection;
  };

export function mapUpNextResponse(item: UpNextResponse): UpNextEntry {
  const show = mapToShowEntry(item.show);
  const episode = mapToEpisodeEntry(item.progress.next_episode);
  episode.runtime = isNaN(episode.runtime) ? show.runtime : episode.runtime;

  const progress = mapToShowProgress(item.progress);
  /*
   * FIXME: `progress.last_episode` is the user's furthest watched episode, not the show's
   *  latest aired episode, so comparing next_episode against it via isLatestAiredEpisode
   *  was effectively always true. As a proxy, treat the next episode as the latest aired
   *  when remaining (aired - completed) is 1 or less - i.e. no further aired episode
   *  exists beyond the displayed one. Replace once the API surfaces an absolute
   *  "latest aired episode" reference.
   */
  const isLatestAired = (item.progress.aired - item.progress.completed) <= 1;

  return {
    show,
    ...episode,
    ...progress,
    isLatestAired,
  };
}

export const upNextNitroRequest = (
  params: UpNextParams,
) => {
  const { fetch, limit, page, filter, sortBy, sortHow } = params;

  return api({ fetch })
    .sync
    .progress
    .upNext
    .nitro({
      query: {
        page,
        limit,
        intent: 'continue',
        ...filter,
        ...(sortBy ? { sort_by: sortBy } : {}),
        ...(sortHow ? { sort_how: sortHow } : {}),
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
    params.sortBy,
    params.sortHow,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: upNextNitroRequest,
  mapper: (response) => {
    return {
      entries: response.body
        .filter((item) => item.progress.next_episode != null)
        .map(mapUpNextResponse),
      page: extractPageMeta(response.headers),
    };
  },
  schema: PaginatableSchemaFactory(UpNextEntrySchema),
  ttl: time.minutes(30),
  refetchOnWindowFocus: true,
});
