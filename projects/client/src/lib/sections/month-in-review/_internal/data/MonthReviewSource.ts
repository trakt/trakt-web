import type { Observable } from 'rxjs';
import type { Review } from '$lib/sections/review/models/Review.ts';

export type MonthReviewSource = {
  review: Observable<Review | null>;
  isLoading: Observable<boolean>;
};
