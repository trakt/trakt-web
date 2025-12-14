import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Observable } from 'rxjs';

export type PaginatableStore<T, M = MediaType> = (
  params: { type: M; limit: number } & FilterParams,
) => {
  list: Observable<T[]>;
  isLoading: Observable<boolean>;
  fetchNextPage: () => Promise<void>;
  hasNextPage: Observable<boolean>;
};
