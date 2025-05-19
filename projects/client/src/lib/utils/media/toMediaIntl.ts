import type { MediaEntry } from '../../requests/models/MediaEntry.ts';
import type { MediaIntl } from '../../requests/models/MediaIntl.ts';

export function toMediaIntl(item?: MediaIntl | MediaEntry): MediaIntl {
  return {
    title: item?.title ?? '',
    overview: item?.overview ?? '',
    tagline: item?.tagline ?? '',
  };
}
