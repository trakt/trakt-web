import type { MovieSchema } from '../../../search/schema/MovieSchema.ts';
import type { ShowSchema } from '../../../search/schema/ShowSchema.ts';
import { toIds } from './toIds.ts';
import { toImageArray } from './toImageArray.ts';

export function toCommonMedia(
  input: (ShowSchema | MovieSchema) & { slug: string },
) {
  return {
    title: input.title,
    year: input.year,
    ids: toIds(input),
    runtime: input.runtime,
    status: input.status,
    genres: input.genre_slugs,
    original_title: input.original_title,
    images: {
      poster: toImageArray(input.poster_url),
    },
  };
}
