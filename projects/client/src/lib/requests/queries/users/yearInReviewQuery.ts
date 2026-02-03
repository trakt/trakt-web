import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToUserReview, UserReviewSchema } from './monthInReviewQuery.ts';

export type YearInReviewParams = {
  slug: string;
  year: number;
} & ApiParams;

const yearInReviewRequest = (
  { fetch, year, slug }: YearInReviewParams,
) =>
  api({ fetch })
    .users
    .year_in_review({
      params: {
        id: slug,
        year,
      },
      query: {
        extended: 'images',
      },
    });

export const yearInReviewQuery = defineQuery({
  key: 'yearInReview',
  request: yearInReviewRequest,
  invalidations: [],
  dependencies: (params) => [params.slug, params.year],
  mapper: (response) => mapToUserReview(response.body),
  schema: UserReviewSchema,
  ttl: time.hours(3),
});
