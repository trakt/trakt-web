import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToEpisodeEntry } from '$lib/requests/_internal/mapToEpisodeEntry.ts';
import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeEntrySchema } from '$lib/requests/models/EpisodeEntry.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MediaCommentSchema } from '$lib/requests/models/MediaComment.ts';
import { MediaEntrySchema } from '$lib/requests/models/MediaEntry.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { UserCommentResponse } from '@trakt/api';
import { z } from 'zod';
import type { PaginationParams } from '../../models/PaginationParams.ts';

type UserCommentsParams =
  & {
    slug: string;
  }
  & ApiParams
  & PaginationParams;

const MovieShowCommentEntrySchema = z.object({
  key: z.string(),
  activityType: z.literal('reviews'),
  comment: MediaCommentSchema,
  media: MediaEntrySchema,
  type: z.enum(['movie', 'show']),
});

const EpisodeCommentEntrySchema = z.object({
  key: z.string(),
  activityType: z.literal('reviews'),
  comment: MediaCommentSchema,
  media: ShowEntrySchema,
  episode: EpisodeEntrySchema,
  type: z.literal('episode'),
});

export const UserCommentEntrySchema = z.discriminatedUnion('type', [
  MovieShowCommentEntrySchema,
  EpisodeCommentEntrySchema,
]);
export type UserCommentEntry = z.infer<typeof UserCommentEntrySchema>;

const SUPPORTED_COMMENT_TYPES = ['movie', 'show', 'episode'] as const;
type SupportedCommentType = typeof SUPPORTED_COMMENT_TYPES[number];
type SupportedCommentResponse = Extract<
  UserCommentResponse,
  { type: SupportedCommentType }
>;

const isSupportedComment = (
  item: UserCommentResponse,
): item is SupportedCommentResponse =>
  (SUPPORTED_COMMENT_TYPES as ReadonlyArray<string>).includes(item.type);

const mapToCommentEntry = (
  item: SupportedCommentResponse,
): UserCommentEntry => {
  const comment = mapToMediaComment(item.comment);
  const common = {
    key: comment.key,
    activityType: 'reviews' as const,
    comment,
  };

  switch (item.type) {
    case 'movie':
      return { ...common, media: mapToMovieEntry(item.movie), type: 'movie' };
    case 'show':
      return { ...common, media: mapToShowEntry(item.show), type: 'show' };
    case 'episode': {
      return {
        ...common,
        media: mapToShowEntry(item.show),
        episode: mapToEpisodeEntry(item.episode),
        type: 'episode',
      };
    }
  }
};

const userCommentsRequest = (
  { fetch, slug, limit, page }: UserCommentsParams,
) =>
  api({ fetch })
    .users
    .comments({
      params: { id: slug, comment_type: 'all', type: 'all' },
      query: { extended: 'full,images', page, limit },
    });

export const userCommentsQuery = defineInfiniteQuery({
  key: 'userComments',
  invalidations: [
    InvalidateAction.Comment.Post('movie'),
    InvalidateAction.Comment.Post('show'),
    InvalidateAction.Comment.Post('episode'),
  ],
  dependencies: (params: UserCommentsParams) => [
    params.slug,
    params.limit,
    params.page,
  ],
  request: userCommentsRequest,
  mapper: (response) => ({
    entries: response.body
      .filter(isSupportedComment)
      .map(mapToCommentEntry),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(UserCommentEntrySchema),
  ttl: time.hours(1),
});
