import { MediaTypeSchema } from '$lib/requests/models/MediaType.ts';

export function catalogSitemapPaths(): string[] {
  return MediaTypeSchema.options.map((type) => `/sitemap/catalog/${type}s.xml`);
}
