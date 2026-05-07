import type { HistoryEntry } from '$lib/sections/lists/stores/models/HistoryEntry.ts';

export type SlottedEntry = {
  key: string;
  startDate: Date;
  endDate: Date;
  entry: HistoryEntry | Nil;
};
