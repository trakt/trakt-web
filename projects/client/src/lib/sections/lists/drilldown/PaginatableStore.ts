import type { MediaType } from '$lib/requests/models/MediaType';
import type { Readable } from 'svelte/store';

export type PaginatableStore<T, M = MediaType> = (
  params: { type: M; page: number; limit: number },
) => {
  list: Readable<T[]>;
  page: Readable<{ total?: number }>;
  isLoading: Readable<boolean>;
};
