import { unixToDate } from '$lib/utils/date/unixToDate.ts';
import type { MovieSchema } from '$lib/requests/search/schema/MovieSchema.ts';
import { toCommonMedia } from './toCommonMedia.ts';

export function toMovie(input: MovieSchema & { slug: string }) {
  const common = toCommonMedia(input);

  return {
    ...common,
    released: unixToDate(input.released),
  };
}
