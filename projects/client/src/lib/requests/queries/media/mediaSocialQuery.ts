import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapToUserProfile.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import {
  type MediaSocial,
  MediaSocialSchema,
} from '$lib/requests/models/MediaSocial.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { ProfileResponse } from '@trakt/api';
import { z } from 'zod';

type MediaSocialMovieTarget = {
  type: 'movie';
  slug: string;
};

type MediaSocialShowTarget = {
  type: 'show';
  slug: string;
};

type MediaSocialEpisodeTarget = {
  type: 'episode';
  slug: string;
  season: number;
  episode: number;
};

export type MediaSocialQueryTarget =
  | MediaSocialMovieTarget
  | MediaSocialShowTarget
  | MediaSocialEpisodeTarget;

type MediaSocialParams =
  & MediaSocialQueryTarget
  & PaginationParams
  & ApiParams;

const MediaSocialUserResponseSchema = z.object({
  username: z.string(),
  private: z.boolean().default(false),
  deleted: z.boolean().default(false),
  name: z.string().nullish().default(null),
  vip: z.boolean().nullish(),
  vip_ep: z.boolean().nullish(),
  director: z.boolean().nullish(),
  ids: z.object({
    slug: z.string().nullish(),
    trakt: z.number(),
  }),
  images: z.object({
    avatar: z.object({
      full: z.string().nullish(),
    }).default({ full: null }),
  }).default({ avatar: { full: null } }),
  location: z.string().nullish().default(null),
  about: z.string().nullish().default(null),
  vip_cover_image: z.string().nullish().default(null),
  joined_at: z.string().nullish().default(null),
}).passthrough();

const MediaSocialRatingResponseSchema = z.object({
  rating: z.number(),
  rated_at: z.string().nullish(),
});

const MediaSocialCommentResponseSchema = z.object({
  ids: z.object({ trakt: z.number() }),
  comment: z.string().nullish(),
  spoiler: z.boolean(),
  review: z.boolean(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

const MediaSocialWatchedResponseSchema = z.object({
  plays: z.number(),
  last_watched_at: z.string().nullish(),
  last_updated_at: z.string().nullish(),
  rating: MediaSocialRatingResponseSchema.optional(),
  comment: MediaSocialCommentResponseSchema.optional(),
});

const MediaSocialWatchlistedResponseSchema = z.object({
  listed_at: z.string(),
});

export const MediaSocialResponseSchema = z.array(
  z.object({
    followed_at: z.string(),
    user: MediaSocialUserResponseSchema,
    watched: MediaSocialWatchedResponseSchema.optional(),
    watchlisted: MediaSocialWatchlistedResponseSchema.optional(),
  }),
);

export type MediaSocialResponse = z.infer<typeof MediaSocialResponseSchema>;
export type MediaSocialResponseInput = z.input<
  typeof MediaSocialResponseSchema
>;
type MediaSocialEntryResponse = MediaSocialResponse[number];
type MediaSocialWatchedResponse = NonNullable<
  MediaSocialEntryResponse['watched']
>;
type MediaSocialWatched = NonNullable<MediaSocial['watched']>;

function toDate(value: string | null | undefined): Date | null {
  if (value == null) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toSocialPath(params: MediaSocialQueryTarget): string {
  const slug = encodeURIComponent(params.slug);

  switch (params.type) {
    case 'movie':
      return `/movies/${slug}/social`;
    case 'show':
      return `/shows/${slug}/social`;
    case 'episode':
      return `/shows/${slug}/seasons/${params.season}/episodes/${params.episode}/social`;
  }
}

function toSocialSearchParams(params: PaginationParams): string {
  const searchParams = new URLSearchParams();

  if (params.page != null) {
    searchParams.set('page', String(params.page));
  }

  if (params.limit != null) {
    searchParams.set('limit', String(params.limit));
  }

  const search = searchParams.toString();
  return search.length > 0 ? `?${search}` : '';
}

function getTargetDependencies(params: MediaSocialQueryTarget) {
  return params.type === 'episode'
    ? [params.type, params.slug, params.season, params.episode]
    : [params.type, params.slug];
}

function getInvalidations(): ReturnType<typeof InvalidateAction.Rated>[] {
  const types: ExtendedMediaType[] = ['movie', 'show', 'episode'];

  return types.flatMap((type) => [
    InvalidateAction.Rated(type),
    InvalidateAction.MarkAsWatched(type),
    InvalidateAction.Comment.Post(type),
  ]);
}

function mapToSocialComment(
  comment: MediaSocialWatchedResponse['comment'] | undefined,
): MediaSocialWatched['comment'] | undefined {
  if (comment == null) return undefined;

  const id = comment.ids.trakt;

  return {
    id,
    key: `comment-${id}`,
    comment: comment.comment ?? '',
    isSpoiler: comment.spoiler,
    isReview: comment.review,
    createdAt: toDate(comment.created_at),
    updatedAt: toDate(comment.updated_at),
  };
}

function mapToSocialRating(
  rating: MediaSocialWatchedResponse['rating'] | undefined,
): MediaSocialWatched['rating'] | undefined {
  if (rating == null) return undefined;

  return {
    rating: rating.rating,
    ratedAt: toDate(rating.rated_at),
  };
}

function mapToSocialWatched(
  watched: MediaSocialEntryResponse['watched'] | undefined,
): MediaSocialWatched | undefined {
  if (watched == null) return undefined;

  const rating = mapToSocialRating(watched.rating);
  const comment = mapToSocialComment(watched.comment);

  return {
    plays: watched.plays,
    lastWatchedAt: toDate(watched.last_watched_at),
    lastUpdatedAt: toDate(watched.last_updated_at),
    ...(rating && { rating }),
    ...(comment && { comment }),
  };
}

function mapToMediaSocial(entry: MediaSocialEntryResponse): MediaSocial {
  const user = mapToUserProfile(entry.user as ProfileResponse);
  const watched = mapToSocialWatched(entry.watched);
  const watchlisted = entry.watchlisted == null
    ? undefined
    : { listedAt: new Date(entry.watchlisted.listed_at) };

  return {
    key: `media-social-${user.id}`,
    followedAt: new Date(entry.followed_at),
    user,
    ...(watched && { watched }),
    ...(watchlisted && { watchlisted }),
  };
}

const mediaSocialRequest = async (
  { fetch, ...params }: MediaSocialParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: `${toSocialPath(params)}${toSocialSearchParams(params)}`,
  });

  if (response.status === 204) {
    return {
      body: [],
      headers: response.headers,
      status: 204,
    };
  }

  if (!response.ok) {
    return {
      body: [],
      headers: response.headers,
      status: response.status,
    };
  }

  return {
    body: MediaSocialResponseSchema.parse(await response.json()),
    headers: response.headers,
    status: 200,
  };
};

export const mediaSocialQuery = defineInfiniteQuery({
  key: 'mediaSocial',
  invalidations: [
    InvalidateAction.User.Follow,
    InvalidateAction.Watchlisted('movie'),
    InvalidateAction.Watchlisted('show'),
    ...getInvalidations(),
  ],
  dependencies: (
    params: MediaSocialParams,
  ) => [
    ...getTargetDependencies(params),
    params.page,
    params.limit,
  ],
  request: mediaSocialRequest,
  mapper: (response, params) => ({
    entries: response.body.map(mapToMediaSocial),
    page: extractPageMeta(response.headers, params.page),
  }),
  schema: PaginatableSchemaFactory(MediaSocialSchema),
  ttl: time.minutes(5),
});
