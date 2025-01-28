import type { MediaType } from '$lib/requests/models/MediaType';
import type { Snippet } from 'svelte';

export type DrillListProps<T> = {
  id: string;
  title: string;
  type: MediaType;
  item: Snippet<[T]>;
  urlBuilder: (params: { type: MediaType } & Record<string, unknown>) => string;
};
