import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { CommentSortType } from '$lib/requests/models/CommentSortType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { LimitlessParams } from '$lib/requests/models/LimitlessParams.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { castNumberAsString } from '$lib/utils/requests/castNumberAsString.ts';
import { time } from '$lib/utils/timing/time.ts';

type EpisodeCommentsParams =
  & { slug: string; season: number; episode: number; sort: CommentSortType }
  & ApiParams
  & LimitlessParams;

const showCommentsRequest = (
  { fetch, slug, season, episode, limit, sort }: EpisodeCommentsParams,
) =>
  api({ fetch })
    .shows
    .episode
    .comments({
      params: {
        id: slug,
        season: castNumberAsString(season),
        episode,
        sort,
      },
      query: {
        extended: 'images',
        limit,
      },
    });

export const episodeCommentsQuery = defineQuery({
  key: 'episodeComments',
  invalidations: [InvalidateAction.Comment.Post('episode')],
  dependencies: (
    params,
  ) => [params.slug, params.season, params.episode, params.limit, params.sort],
  request: showCommentsRequest,
  mapper: (response) => response.body.map(mapToMediaComment),
  schema: MediaCommentSchema.array(),
  ttl: time.minutes(30),
});
