import type { ImportIds } from '../ImportTypes.ts';

export type IdPriority = ReadonlyArray<keyof ImportIds>;

export const MOVIE_IDS: IdPriority = ['imdb', 'tmdb', 'trakt'];
export const SHOW_IDS: IdPriority = ['imdb', 'tvdb', 'trakt', 'tmdb'];
export const SEASON_IDS: IdPriority = ['tvdb', 'trakt', 'tmdb'];
export const EPISODE_IDS: IdPriority = ['tvdb', 'trakt', 'tmdb', 'imdb'];
// An episode row carrying season/episode numbers may be describing its show
// (TV Time liberator and hand written CSVs both do), so tmdb and imdb are only
// trusted as episode ids when no positional numbers accompany them.
export const POSITIONAL_EPISODE_IDS: IdPriority = ['tvdb', 'trakt'];

export function toEpisodeIdPriority(
  item: { season?: number; episode?: number },
): IdPriority {
  const isPositionalShaped = item.season != null && item.episode != null;
  return isPositionalShaped ? POSITIONAL_EPISODE_IDS : EPISODE_IDS;
}

export type ResolvedIds = Record<string, string | number>;

export function pickIds(
  ids: ImportIds,
  priority: IdPriority,
): ResolvedIds | null {
  const key = priority.find((k) => ids[k] != null);
  if (!key) return null;

  const value = ids[key];
  if (value == null) return null;

  return { [key]: value };
}
