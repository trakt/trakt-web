import type { MultiSelectSelection } from '$lib/components/select/models/MultiSelectSelection.ts';
import { EpisodeComputedType } from '$lib/requests/models/EpisodeType.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { UpcomingEpisodeEntry } from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';

/*
  A `full_season` card is built upstream from a day that held both a premiere
  and a finale, and the individual episodes are dropped in the process - unlike
  `multiple_episodes`, which keeps them on `episodes`. All that survives is
  that the span opens and closes a season, so the card answers to any of these
  roles rather than being hidden from every one of them.
*/
const FULL_SEASON_ROLES: ReadonlyArray<string> = [
  'series_premiere',
  'season_premiere',
  'series_finale',
  'season_finale',
];

function toEpisodeRoles(
  item: UpcomingEpisodeEntry | MediaEntry,
): ReadonlyArray<string> | null {
  if (!('show' in item)) {
    return null;
  }

  if (item.type === EpisodeComputedType.full_season) {
    return FULL_SEASON_ROLES;
  }

  const grouped = item.episodes ?? [];
  return grouped.length > 0
    ? grouped.map((episode) => episode.type)
    : [item.type];
}

/**
 * Whether a calendar entry survives the episode role filter. Inclusions match
 * any listed role, exclusions must all be absent, and an empty selection keeps
 * everything.
 */
export function matchesEpisodeTypeFilter(
  item: UpcomingEpisodeEntry | MediaEntry,
  { included, excluded }: MultiSelectSelection,
): boolean {
  if (included.length === 0 && excluded.length === 0) {
    return true;
  }

  const roles = toEpisodeRoles(item);

  /*
    A movie carries no episode role at all. Including a role is a request for a
    role-specific feed, so movies drop out; excluding one only removes matching
    episodes and leaves movies where they are.
  */
  if (roles == null) {
    return included.length === 0;
  }

  if (excluded.some((role) => roles.includes(role))) {
    return false;
  }

  return included.length === 0 ||
    included.some((role) => roles.includes(role));
}
