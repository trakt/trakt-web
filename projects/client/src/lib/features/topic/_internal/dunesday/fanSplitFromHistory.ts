import type { ActivityHistory } from '$lib/requests/queries/users/activityHistoryQuery.ts';
import type { FanSplit } from './FanSplit.ts';

const DUNE_GENRE = 'science-fiction';
const DOOM_GENRE = 'superhero';

const genresOf = (entry: ActivityHistory): ReadonlyArray<string> =>
  entry.type === 'movie' ? entry.movie.genres : entry.show.genres;

export function fanSplitFromHistory(
  entries: ReadonlyArray<ActivityHistory>,
): FanSplit {
  const genres = entries.map(genresOf);

  return {
    dune: genres.filter((list) => list.includes(DUNE_GENRE)).length,
    doom: genres.filter((list) => list.includes(DOOM_GENRE)).length,
    plays: entries.length,
    source: entries.length > 0 ? 'history' : 'cosmetic',
  };
}
