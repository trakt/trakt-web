import type { Nudge, NudgeLimit } from '$lib/requests/models/Nudge.ts';
import type { NudgeResponse } from '$lib/requests/models/NudgeResponse.ts';

const LIMIT_BY_METRIC: ReadonlyMap<string, NudgeLimit> = new Map([
  ['watchlist_items', 'watchlistItems'],
  ['total_list_items', 'totalListItems'],
  ['static_lists', 'staticLists'],
  ['total_notes', 'totalNotes'],
]);

export function mapToNudge(response: NudgeResponse | Nil): Nudge | null {
  const nudge = response?.nudge;

  if (!nudge) return null;
  if (nudge.type === 'vip') return { type: 'vip' };
  if (nudge.type !== 'limit') return null;

  const limit = LIMIT_BY_METRIC.get(nudge.limit ?? '');
  if (!limit) return null;
  if (nudge.used == null || nudge.total == null) return null;

  return { type: 'limit', limit, used: nudge.used, total: nudge.total };
}
