import { RECENTLY_WATCHED_WINDOW } from '../constants/index.ts';
import type { DismissedItem } from '../models/DismissedItem.ts';

export function normalizeDismissalItems(
  items: DismissedItem[],
): DismissedItem[] {
  const cutoff = Date.now() - RECENTLY_WATCHED_WINDOW;
  return items.filter((item) => item.dismissedAt >= cutoff);
}
