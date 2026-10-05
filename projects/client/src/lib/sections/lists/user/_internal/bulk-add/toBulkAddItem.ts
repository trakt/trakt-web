import type { ListItem } from '$lib/requests/models/ListItem.ts';
import type { BulkAddItem } from './BulkAddItem.ts';
import { toListedKey } from './toListedKey.ts';

export function toBulkAddItem(item: ListItem): BulkAddItem[] {
  const key = toListedKey(item);
  if (!key) return [];
  if (item.type !== 'movie' && item.type !== 'show') return [];

  const { entry } = item;

  return [{
    key,
    type: item.type,
    id: entry.id,
    title: entry.title,
    year: entry.year,
    posterUrl: entry.poster.url.thumb,
  }];
}
