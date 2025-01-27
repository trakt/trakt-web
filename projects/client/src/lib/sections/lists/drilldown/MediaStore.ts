import type { MediaType } from '$lib/requests/models/MediaType';
import type { Readable } from 'svelte/store';

export type MediaStore<T> = (
  params: { type: MediaType; limit?: number },
) => {
  list: Readable<T[]>;
  isLoading: Readable<boolean>;
};
