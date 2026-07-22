import { unixToDate } from '../../../../utils/date/unixToDate.ts';
import type { MovieSchema } from '../../../search/schema/MovieSchema.ts';
import { toCommonMedia } from './toCommonMedia.ts';

export function toMovie(input: MovieSchema & { slug: string }) {
  const common = toCommonMedia(input);

  return {
    ...common,
    released: unixToDate(input.released),
  };
}
