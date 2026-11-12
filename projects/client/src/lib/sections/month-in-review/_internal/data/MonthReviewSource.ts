import type { Observable } from 'rxjs';
import type { MonthReview } from '../models/MonthReview.ts';

export type MonthReviewSource = {
  review: Observable<MonthReview | null>;
  isLoading: Observable<boolean>;
};
