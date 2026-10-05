import type { ListItem } from '$lib/requests/models/ListItem.ts';

export function toListedKey(item: ListItem): string | undefined {
  if (item.type === 'movie' || item.type === 'show') {
    return `${item.type}:${item.entry.id}`;
  }

  return undefined;
}
