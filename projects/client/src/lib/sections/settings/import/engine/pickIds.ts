import type { ImportIds } from '../ImportTypes.ts';

export type IdPriority = ReadonlyArray<keyof ImportIds>;

export const MOVIE_IDS: IdPriority = ['imdb', 'tmdb', 'trakt'];
export const SHOW_IDS: IdPriority = ['imdb', 'tvdb', 'trakt'];
export const EPISODE_IDS: IdPriority = ['tvdb', 'trakt'];

export function pickIds(
  ids: ImportIds,
  priority: IdPriority,
): Record<string, string | number> | null {
  const key = priority.find((k) => ids[k] != null);
  return key ? { [key]: ids[key]! } : null;
}
