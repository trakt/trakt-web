import {
  EpisodeComputedType,
  type EpisodeType,
} from '$lib/requests/models/EpisodeType.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { UpcomingEpisodeEntry } from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
import type { EpisodeTypeFilter } from './models/EpisodeTypeFilter.ts';

const ROLES: Record<
  Exclude<EpisodeTypeFilter, 'all'>,
  ReadonlyArray<EpisodeType>
> = {
  premieres: ['series_premiere', 'season_premiere', 'mid_season_premiere'],
  finales: ['mid_season_finale', 'season_finale', 'series_finale'],
};

const FULL_SEASON_ROLES: ReadonlyArray<EpisodeType> = [
  'season_premiere',
  'season_finale',
];

function toEpisodeRoles(
  item: UpcomingEpisodeEntry | MediaEntry,
): ReadonlyArray<EpisodeType> | null {
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

export function matchesEpisodeTypeFilter(
  item: UpcomingEpisodeEntry | MediaEntry,
  filter: EpisodeTypeFilter,
): boolean {
  if (filter === 'all') {
    return true;
  }

  const roles = toEpisodeRoles(item);

  if (roles == null) {
    return false;
  }

  return roles.some((role) => ROLES[filter].includes(role));
}
