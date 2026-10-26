import { SHOW_BINGE_WINDOW } from '../constants/index.ts';
import type { DismissedItem } from '../models/DismissedItem.ts';

export function normalizeDismissalItems(
  items: DismissedItem[],
): DismissedItem[] {
  const cutoff = Date.now() - SHOW_BINGE_WINDOW;
  return items.filter((item) => item.dismissedAt >= cutoff);
}
