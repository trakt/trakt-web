import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type MediaReactionsTarget = {
  type: MediaType;
  slug: string;
  id: number;
};
