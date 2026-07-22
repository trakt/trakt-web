import type { MediaType } from '../../../models/MediaType.ts';
import type { MovieSchema } from '../../../search/schema/MovieSchema.ts';
import type { ShowSchema } from '../../../search/schema/ShowSchema.ts';
import { toMovie } from './toMovie.ts';
import { toShow } from './toShow.ts';

type MediaDocument = (ShowSchema | MovieSchema) & { slug: string };

export function toMedia(type: MediaType, input: MediaDocument) {
  switch (type) {
    case 'movie':
      return toMovie(input as MovieSchema & { slug: string });
    case 'show':
      return toShow(input as ShowSchema & { slug: string });
    default:
      throw new Error(`Unsupported media type: ${type}`);
  }
}
