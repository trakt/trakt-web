import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToEpisodeEntry } from '$lib/requests/_internal/mapToEpisodeEntry.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapToUserProfile.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import {
  type SocialActivity,
  SocialActivitySchema,
} from '$lib/requests/models/SocialActivity.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { SocialActivityResponse } from '@trakt/api';
import { coalesceSocialActivities } from '../../_internal/coalesceSocialActivities.ts';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import type { FilterParams } from '../../models/FilterParams.ts';

type SocialActivityParams = PaginationParams & ApiParams & FilterParams;

function mapToSocialActivity(
  response: SocialActivityResponse,
): SocialActivity {
  const common = {
    key: `${response.id}`,
    activityAt: new Date(response.activity_at),
    users: [mapToUserProfile(response.user)],
  };

  switch (response.type) {
    case 'movie':
      return {
        ...common,
        type: 'movie',
        movie: mapToMovieEntry(assertDefined(response.movie)),
      };
    case 'episode':
      return {
        ...common,
        type: 'episode',
        episode: mapToEpisodeEntry(assertDefined(response.episode)),
        show: mapToShowEntry(assertDefined(response.show)),
      };
  }
}

const socialActivityRequest = (
  { fetch, limit, page, filter }: SocialActivityParams,
) =>
  api({ fetch })
    .users
    .activities({
      params: {
        id: 'me',
        type: 'following',
      },
      query: {
        extended: 'full,images',
        limit,
        page,
        ...filter,
      },
    });

export const socialActivityQuery = defineQuery({
  key: 'socialActivity',
  invalidations: [InvalidateAction.User.Follow],
  dependencies: (
    params,
  ) => [
    params.limit,
    params.page,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: socialActivityRequest,
  mapper: (response) => {
    // FIXME: automatically fetch more if coalesced
    const activities = response.body.map(mapToSocialActivity);
    return {
      entries: coalesceSocialActivities(activities),
      page: extractPageMeta(response.headers),
    };
  },
  schema: PaginatableSchemaFactory(SocialActivitySchema),
  ttl: time.minutes(15),
});
