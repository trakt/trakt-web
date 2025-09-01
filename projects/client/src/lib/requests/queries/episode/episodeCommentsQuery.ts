import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { LimitlessParams } from '$lib/requests/models/LimitlessParams.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { castNumberAsString } from '$lib/utils/requests/castNumberAsString.ts';
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
        season: castNumberAsString(season),
        episode,
        sort: DEFAULT_COMMENT_SORT,
      },
      query: {
        extended: 'images',
        limit,
      },
    });

export const episodeCommentsQuery = defineQuery({
  key: 'episodeComments',
  invalidations: [InvalidateAction.Commented('episode')],
  dependencies: (
    params,
  ) => [params.slug, params.season, params.episode, params.limit],
  request: showCommentsRequest,
  mapper: (response) => response.body.map(mapToMediaComment),
  schema: MediaCommentSchema.array(),
  ttl: time.minutes(30),
});
