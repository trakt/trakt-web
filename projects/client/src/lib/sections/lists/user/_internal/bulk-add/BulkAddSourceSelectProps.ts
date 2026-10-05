import type { BulkAddSource } from './BulkAddSource.ts';

export type BulkAddSourceSelectProps = {
  sources: ReadonlyArray<BulkAddSource>;
  activeKey: string;
  pickedCounts: Readonly<Record<string, number>>;
  onSelect: (key: string) => void;
};
