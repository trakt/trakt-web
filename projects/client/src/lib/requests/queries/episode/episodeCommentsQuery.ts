import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { LimitlessParams } from '$lib/requests/models/LimitlessParams.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { time } from '$lib/utils/timing/time.ts';

const DEFAULT_COMMENT_SORT = 'likes' as const;

type EpisodeCommentsParams =
  & { slug: string; season: number; episode: number }
  & ApiParams
  & LimitlessParams;

const showCommentsRequest = (
  { fetch, slug, season, episode, limit }: EpisodeCommentsParams,
) =>
  api({ fetch })
    .shows
    .episode
    .comments({
      params: {
        id: slug,
        season,
        episode,
        sort: DEFAULT_COMMENT_SORT,
      },
      query: {
        extended: 'images',
        limit,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch episode comments');
      }

      return response.body;
    });

export const episodeCommentsQuery = defineQuery({
  key: 'episodeComments',
  invalidations: [InvalidateAction.Like],
  dependencies: (
    params,
  ) => [params.slug, params.season, params.episode, params.limit],
  request: showCommentsRequest,
  mapper: (data) => data.map(mapToMediaComment),
  schema: MediaCommentSchema.array(),
  ttl: time.minutes(30),
});
