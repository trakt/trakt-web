import type { SmartListItemResponse } from '$lib/requests/models/SmartListItemResponse.ts';
import { mapToSmartListItem } from './mapToSmartListItem.ts';

export function mapToSmartListPosters(
  items: ReadonlyArray<SmartListItemResponse>,
): string[] {
  return items.map((item) => mapToSmartListItem(item).poster.url.thumb);
}
