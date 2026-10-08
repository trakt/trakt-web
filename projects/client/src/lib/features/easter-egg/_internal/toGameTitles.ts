import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { GameTitle } from './GameTitle.ts';

const MIN_VOTES = 500;

function toGameTitle(entry: MediaEntry): GameTitle | null {
  if (entry.rating === null || entry.rating === undefined) return null;
  if (entry.votes < MIN_VOTES) return null;

  return {
    key: entry.key,
    title: entry.title,
    type: entry.type,
    year: entry.year,
    rating: Math.round(entry.rating * 100),
    poster: entry.poster.url.medium,
  };
}

export function toGameTitles(
  entries: ReadonlyArray<MediaEntry>,
): ReadonlyArray<GameTitle> {
  return entries
    .map(toGameTitle)
    .filter((title): title is GameTitle => title !== null);
}
