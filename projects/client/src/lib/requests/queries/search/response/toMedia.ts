import type { MediaType } from '../../../models/MediaType.ts';
import type { MovieSchema } from '../../../search/schema/MovieSchema.ts';
import type { ShowSchema } from '../../../search/schema/ShowSchema.ts';
import { toMovie } from './toMovie.ts';
import { toShow } from './toShow.ts';

export function toMedia(type: MediaType, input: ShowSchema | MovieSchema) {
  switch (type) {
    case 'movie':
      return toMovie(input as MovieSchema);
    case 'show':
      return toShow(input as ShowSchema);
    default:
      throw new Error(`Unsupported media type: ${type}`);
  }
}
