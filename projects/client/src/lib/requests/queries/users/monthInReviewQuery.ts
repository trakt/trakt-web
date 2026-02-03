import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { MonthInReviewResponse } from '@trakt/api';
import { z } from 'zod';
import { type MediaEntry, MediaEntrySchema } from '../../models/MediaEntry.ts';

export type MonthInReviewParams = {
  slug: string;
  month: number;
  year: number;
} & ApiParams;

export const UserReviewSchema = z.object({
  playCount: z.number(),
  hoursWatched: z.number(),
  ratingsCount: z.number(),
  commentsCount: z.number(),
  libraryCount: z.number(),
  listsCount: z.number(),
  firstPlay: MediaEntrySchema.nullish(),
});

export type UserReview = z.infer<typeof UserReviewSchema>;

export function mapToFirstPlay(
  response: MonthInReviewResponse,
): MediaEntry | null {
  if (!response.first_watched) {
    return null;
  }

  return response.first_watched.type === 'episode'
    ? mapToShowEntry(response.first_watched.show)
    : mapToMovieEntry(response.first_watched.movie);
}

export function mapToUserReview(
  response: MonthInReviewResponse,
): UserReview {
  return {
    playCount: response.stats.all.play_counts.total,
    hoursWatched: Math.round(response.stats.all.minutes.total / 60),
    ratingsCount: response.stats.all.ratings_counts.total,
    commentsCount: response.stats.all.comments_counts.total,
    libraryCount: response.stats.all.collected_counts.total,
    listsCount: response.stats.all.lists_counts.total,
    firstPlay: mapToFirstPlay(response),
  };
}

const monthInReviewRequest = (
  { fetch, month, year, slug }: MonthInReviewParams,
) =>
  api({ fetch })
    .users
    .month_in_review({
      params: {
        id: slug,
        month,
        year,
      },
      query: {
        extended: 'images',
      },
    });

export const monthInReviewQuery = defineQuery({
  key: 'monthInReview:v2',
  request: monthInReviewRequest,
  invalidations: [],
  dependencies: (params) => [params.slug, params.year, params.month],
  mapper: (response) => mapToUserReview(response.body),
  schema: UserReviewSchema,
  ttl: time.hours(3),
});
