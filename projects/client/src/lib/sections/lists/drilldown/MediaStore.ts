import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Readable } from 'svelte/store';

export type MediaStore<T, M = MediaType> = (
  params: { type: M; limit?: number },
) => {
  list: Readable<T[]>;
  isLoading: Readable<boolean>;
};
