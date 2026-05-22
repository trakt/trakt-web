import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import type { ListItem } from '$lib/requests/models/ListItem.ts';
import { isListItemWatched } from './isListItemWatched.ts';

export type ListProgress = {
  total: number;
  watched: number;
  remaining: number;
  percentage: number;
};

export function getListProgress(
  items: ReadonlyArray<ListItem>,
  history: UserHistory | null,
): ListProgress {
  const total = items.length;

  if (!history || total === 0) {
    return { total, watched: 0, remaining: total, percentage: 0 };
  }

  const watched = items.reduce(
    (count, item) => count + (isListItemWatched(item, history) ? 1 : 0),
    0,
  );

  return {
    total,
    watched,
    remaining: total - watched,
    percentage: Math.round((watched / total) * 100),
  };
}
