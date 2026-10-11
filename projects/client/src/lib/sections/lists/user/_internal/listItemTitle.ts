import type { ListItem } from '$lib/requests/models/ListItem.ts';

/**
 * Human-readable title for any `ListItem`, regardless of media type. Used
 * where an item needs a single display string outside of its own card
 * rendering - e.g. the bulk-selection checkbox's accessible name.
 */
export function listItemTitle(item: ListItem): string {
  switch (item.type) {
    case 'movie':
    case 'show':
      return item.entry.title;
    case 'season':
    case 'episode':
      return item.entry.show.title;
  }
}
