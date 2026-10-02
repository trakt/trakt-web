import type { MediaType } from '$lib/requests/models/MediaType.ts';

export function toMediaReactionsPath(type: MediaType, slug: string) {
  return `/v3/${type}s/${slug}/reactions`;
}
