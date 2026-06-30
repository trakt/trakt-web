import { m } from '$lib/paraglide/messages';
import { yirUnit } from './yirUnit.ts';

/**
 * Singular/plural unit noun for a media-typed list, e.g. "1 movie" / "3 shows".
 */
export function yirMediaUnit(
  type: 'shows' | 'movies',
  count: number,
): string {
  return type === 'movies'
    ? yirUnit(count, m.yir_unit_movie, m.yir_unit_movies)
    : yirUnit(count, m.yir_unit_show, m.yir_unit_shows);
}
