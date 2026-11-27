import { toMediaImageUrl } from '$lib/utils/url/toMediaImageUrl.ts';
import type { LoreMovie } from '../models/LoreMovie.ts';
import type { LoreMovieResponse } from '../models/LoreMovieResponse.ts';

export function mapToLoreMovie({
  id,
  slug,
  title,
  year,
  poster,
}: LoreMovieResponse): LoreMovie {
  return {
    id,
    slug,
    title,
    year: year ?? null,
    poster: poster
      ? toMediaImageUrl({ type: 'movies', id, slot: 'poster', size: 'thumb' })
      : null,
  };
}
