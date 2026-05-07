import type { HistoryEntry } from '$lib/sections/lists/stores/models/HistoryEntry.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';

export function getSlotKey(
  entry: HistoryEntry,
  nextEntry: HistoryEntry | null,
): string;
export function getSlotKey(
  entry: HistoryEntry | null,
  nextEntry: HistoryEntry,
): string;
export function getSlotKey(
  entry: HistoryEntry | null,
  nextEntry: HistoryEntry | null,
) {
  if (!nextEntry) return assertDefined(entry).key;
  if (!entry) return `now-${nextEntry.key}`;
  return `${entry.key}-${nextEntry.key}`;
}
