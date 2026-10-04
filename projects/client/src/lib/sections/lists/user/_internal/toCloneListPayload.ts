import type { ListItem } from '$lib/requests/models/ListItem.ts';
import type { ListRequest } from '@trakt/api';

type TraktId = { ids: { trakt: number } };

function toTraktId(id: number): TraktId {
  return { ids: { trakt: id } };
}

function toEntryId(item: ListItem): number {
  switch (item.type) {
    case 'movie':
    case 'show':
      return item.entry.id;
    case 'season':
      return item.entry.season.id;
    case 'episode':
      return item.entry.episode.id;
  }
}

/**
 * Groups list items into the bulk payload the list-add endpoint expects.
 * Items are deduped per media type so a repeated entry is only sent once.
 */
export function toCloneListPayload(
  items: ReadonlyArray<ListItem>,
): ListRequest {
  const idsByType = items.reduce((grouped, item) => {
    const ids = grouped.get(item.type) ?? new Set<number>();
    ids.add(toEntryId(item));
    return grouped.set(item.type, ids);
  }, new Map<ListItem['type'], Set<number>>());

  const toPayload = (type: ListItem['type']) =>
    [...idsByType.get(type) ?? []].map(toTraktId);

  return {
    movies: toPayload('movie'),
    shows: toPayload('show'),
    seasons: toPayload('season'),
    episodes: toPayload('episode'),
  };
}
