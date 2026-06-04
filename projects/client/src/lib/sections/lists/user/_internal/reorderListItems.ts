import type { ListItem } from '$lib/requests/models/ListItem.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { ReorderableListItem } from './models/ReorderableListItem.ts';
import { episodeNumberLabel } from '$lib/utils/intl/episodeNumberLabel.ts';
import { seasonLabel } from '$lib/utils/intl/seasonLabel.ts';

function mediaSubtitle(media: MediaEntry): string | undefined {
  return media.year?.toString();
}

function mediaPosterUrl(media: MediaEntry): HttpsUrl {
  return media.poster.url.thumb;
}

export function mapListItemToReorderableItem(
  item: ListItem,
): ReorderableListItem {
  if (item.type === 'movie' || item.type === 'show') {
    return {
      key: item.key,
      listItemId: item.id,
      rank: item.rank,
      title: item.entry.title,
      subtitle: mediaSubtitle(item.entry),
      posterUrl: mediaPosterUrl(item.entry),
    };
  }

  if (item.type === 'season') {
    return {
      key: item.key,
      listItemId: item.id,
      rank: item.rank,
      title: item.entry.show.title,
      subtitle: seasonLabel(item.entry.season.number),
      posterUrl: item.entry.season.poster?.url.thumb ??
        mediaPosterUrl(item.entry.show),
    };
  }

  return {
    key: item.key,
    listItemId: item.id,
    rank: item.rank,
    title: item.entry.show.title,
    subtitle: `${
      episodeNumberLabel({
        seasonNumber: item.entry.episode.season,
        episodeNumber: item.entry.episode.number,
      })
    } - ${item.entry.episode.title}`,
    posterUrl: mediaPosterUrl(item.entry.show),
  };
}

export function sortReorderableItems(
  items: ReorderableListItem[],
): ReorderableListItem[] {
  return [...items].sort((a, b) => a.rank - b.rank);
}

export function itemOrderSignature(items: ReorderableListItem[]): string {
  return items.map((item) => item.key).join('|');
}

export function listItemRankIds(items: ReorderableListItem[]): number[] {
  return items.map((item) => item.listItemId);
}
