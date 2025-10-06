import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type PaginatableStore<T, M = MediaType> = (
  params: { type: M; page: number; limit: number } & FilterParams,
) => {
  list: ReadableOrObservable<T[]>;
  page: ReadableOrObservable<{ total?: number; current?: number }>;
  isLoading: ReadableOrObservable<boolean>;
};
