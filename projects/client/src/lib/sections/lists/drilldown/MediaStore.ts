import type { MediaType } from '$lib/models/MediaType';
import type { Readable } from 'svelte/store';

export type MediaStore<T> = (
  params: { type: MediaType; limit?: number },
) => {
  list: Readable<T[]>;
};
