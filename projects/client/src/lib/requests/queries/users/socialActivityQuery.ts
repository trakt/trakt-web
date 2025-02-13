import type { SocialActivityResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToEpisodeEntry } from '$lib/requests/_internal/mapToEpisodeEntry.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapToUserProfile.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import {
  type SocialActivity,
  SocialActivitySchema,
} from '$lib/requests/models/SocialActivity.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';

type SocialActivityParams = { limit?: number; page?: number } & ApiParams;

function mapToSocialActivity(
  response: SocialActivityResponse,
): SocialActivity {
  const common = {
    id: response.id,
    activityAt: new Date(response.activity_at),
    user: mapToUserProfile(response.user),
  };

  switch (response.type) {
    case 'movie':
      return {
        ...common,
        type: 'movie',
        movie: mapToMovieEntry(response.movie),
      };
    case 'episode':
      return {
        ...common,
        type: 'episode',
        show: mapToShowEntry(response.show),
        episode: mapToEpisodeEntry(response.episode),
      };
  }
}

const socialActivityRequest = (
  { fetch, limit = DEFAULT_PAGE_SIZE, page }: SocialActivityParams,
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
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to social activities');
      }

      return response.body;
    });

export const socialActivityQuery = defineQuery({
  key: 'socialActivity',
  invalidations: [],
  dependencies: (params) => [params.limit, params.page],
  request: socialActivityRequest,
  mapper: (response) => response.map(mapToSocialActivity),
  schema: SocialActivitySchema.array(),
  ttl: time.minutes(15),
});
