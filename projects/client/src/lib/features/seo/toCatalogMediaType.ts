import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { MediaTypeSchema } from '$lib/requests/models/MediaType.ts';

export function toCatalogMediaType(segment: string): MediaType | Nil {
  return MediaTypeSchema.safeParse(segment.replace(/s$/, '')).data;
}
