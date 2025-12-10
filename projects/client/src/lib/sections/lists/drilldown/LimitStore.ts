import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Observable } from 'rxjs';

export type LimitStore<T, M = MediaType> = (
  params: { type: M; limit: number },
) => {
  list: Observable<T[]>;
  isLoading: Observable<boolean>;
};
