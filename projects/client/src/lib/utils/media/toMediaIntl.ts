import type { MediaEntry } from '../../requests/models/MediaEntry.ts';
import type { MediaIntl } from '../../requests/models/MediaIntl.ts';

export function toMediaIntl(
  item?: MediaIntl | MediaEntry,
  fallback?: MediaEntry,
): MediaIntl {
  return {
    title: item?.title ?? fallback?.title ?? '',
    overview: item?.overview ?? fallback?.overview ?? '',
    tagline: item?.tagline ?? fallback?.tagline ?? '',
  };
}
