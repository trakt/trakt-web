import type { BulkAddPick } from './BulkAddPick.ts';
import type { BulkAddSource } from './BulkAddSource.ts';

export type BulkAddSourceItemsProps = {
  source: BulkAddSource;
  listName: string;
  listedKeys: ReadonlySet<string>;
  picks: ReadonlyArray<BulkAddPick>;
  onTogglePick: (pick: BulkAddPick) => void;
  onToggleAllPicks: (picks: ReadonlyArray<BulkAddPick>) => void;
};
