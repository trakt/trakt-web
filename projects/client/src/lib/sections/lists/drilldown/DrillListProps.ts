import type { MediaType } from '$lib/requests/models/MediaType';
import type { Snippet } from 'svelte';

export type DrillListProps<T, M = MediaType> = {
  id: string;
  title: string;
  type: M;
  item: Snippet<[T]>;
  urlBuilder: (params: { type: M } & Record<string, unknown>) => string;
};
