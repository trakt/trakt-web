import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { MonthInReviewResponse } from '@trakt/api';
import { z } from 'zod';

export type MonthInReviewParams = {
  slug: string;
  month: number;
  year: number;
} & ApiParams;

export const UserMonthInReviewSchema = z.object({
  playCount: z.number(),
  hoursWatched: z.number(),
  ratingsCount: z.number(),
  commentsCount: z.number(),
});

export type UserMonthInReview = z.infer<typeof UserMonthInReviewSchema>;

function mapToUserMonthInReview(
  response: MonthInReviewResponse,
): UserMonthInReview {
  return {
    playCount: response.stats.all.play_counts.total,
    hoursWatched: Math.round(response.stats.all.minutes.total / 60),
    ratingsCount: response.stats.all.ratings_counts.total,
    commentsCount: response.stats.all.comments_counts.total,
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
  key: 'monthInReview',
  request: monthInReviewRequest,
  invalidations: [],
  dependencies: (params) => [params.slug, params.year, params.month],
  mapper: (response) => mapToUserMonthInReview(response.body),
  schema: UserMonthInReviewSchema,
  ttl: time.days(1),
});
