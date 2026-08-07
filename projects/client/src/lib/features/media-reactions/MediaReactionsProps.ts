import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type MediaReactionsProps = {
  type: MediaType;
  slug: string;
  title: string;
};
