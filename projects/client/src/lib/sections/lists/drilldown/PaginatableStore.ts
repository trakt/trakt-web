import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type PaginatableStore<T, M = MediaType> = (
  params: { type: M; limit: number } & FilterParams,
) => {
  list: ReadableOrObservable<T[]>;
  isLoading: ReadableOrObservable<boolean>;
  fetchNextPage: ReadableOrObservable<() => Promise<void>>;
  hasNextPage: ReadableOrObservable<boolean>;
};
