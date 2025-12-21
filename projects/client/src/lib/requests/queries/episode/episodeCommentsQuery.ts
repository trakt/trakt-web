import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { CommentSortType } from '$lib/requests/models/CommentSortType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { castNumberAsString } from '$lib/utils/requests/castNumberAsString.ts';
import { time } from '$lib/utils/timing/time.ts';
import { extractPageMeta } from '../../_internal/extractPageMeta.ts';
import { PaginatableSchemaFactory } from '../../models/Paginatable.ts';
import type { PaginationParams } from '../../models/PaginationParams.ts';

type EpisodeCommentsParams =
  & { slug: string; season: number; episode: number; sort: CommentSortType }
  & ApiParams
  & PaginationParams;

const showCommentsRequest = (
  { fetch, slug, season, episode, limit, page, sort }: EpisodeCommentsParams,
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
        page,
      },
    });

export const episodeCommentsQuery = defineInfiniteQuery({
  key: 'episodeComments',
  invalidations: [InvalidateAction.Comment.Post('episode')],
  dependencies: (
    params,
  ) => [
    params.slug,
    params.season,
    params.episode,
    params.page,
    params.limit,
    params.sort,
  ],
  request: showCommentsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToMediaComment),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(MediaCommentSchema),
  ttl: time.minutes(30),
});
