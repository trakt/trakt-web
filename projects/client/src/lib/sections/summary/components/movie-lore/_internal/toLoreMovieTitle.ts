import type { LoreMovie } from '$lib/requests/models/LoreMovie.ts';

export function toLoreMovieTitle({
  title,
  year,
}: Pick<LoreMovie, 'title' | 'year'>) {
  return year == null ? title : `${title} (${year})`;
}
