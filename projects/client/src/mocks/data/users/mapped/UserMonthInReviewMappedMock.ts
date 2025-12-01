import type { UserMonthInReview } from '$lib/requests/queries/users/monthInReviewQuery.ts';
import { MovieHereticMappedMock } from '../../summary/movies/heretic/mapped/MovieHereticMappedMock.ts';

export const UserMonthInReviewMappedMock: UserMonthInReview = {
  'commentsCount': 0,
  'hoursWatched': 12,
  'playCount': 7,
  'ratingsCount': 0,
  'firstPlay': MovieHereticMappedMock,
};
