import { unixToDate } from '../../../../utils/date/unixToDate.ts';
import type { MovieSchema } from '../../../search/schema/MovieSchema.ts';
import { toCommonMedia } from './toCommonMedia.ts';

export function toMovie(input: MovieSchema) {
  const common = toCommonMedia(input);

  return {
    ...common,
    released: unixToDate(input.released),
    after_credits: input.after_credits,
    during_credits: input.during_credits,
    certification: input.certification?.toUpperCase(),
  };
}
