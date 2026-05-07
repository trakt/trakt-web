import type { HistoryEntry } from '$lib/sections/lists/stores/models/HistoryEntry.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { MIN_DATE } from '$lib/utils/constants.ts';
import { getSlotKey } from './getSlotKey.ts';
import type { SlottedEntry } from './models/SlottedEntry.ts';

type MapHistoryToSlotsParams = {
  now: Date;
  list: HistoryEntry[];
};

export function buildHistorySlots(
  { now, list }: MapHistoryToSlotsParams,
): SlottedEntry[] {
  if (list.length === 0) return [];

  const first = assertDefined(list.at(0));
  const last = assertDefined(list.at(-1));

  const entrySlots = list.slice(0, -1).map((entry, i): SlottedEntry => {
    const nextEntry = assertDefined(list.at(i + 1));
    return {
      key: getSlotKey(entry, nextEntry),
      startDate: entry.watchedAt,
      endDate: nextEntry.watchedAt,
      entry,
    };
  });

  return [
    {
      key: getSlotKey(null, first),
      startDate: now,
      endDate: first.watchedAt,
      entry: null,
    },
    ...entrySlots,
    {
      key: getSlotKey(last, null),
      startDate: last.watchedAt,
      endDate: MIN_DATE,
      entry: null,
    },
  ];
}
