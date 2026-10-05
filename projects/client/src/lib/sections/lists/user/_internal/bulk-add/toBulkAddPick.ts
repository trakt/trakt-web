import type { BulkAddItem } from './BulkAddItem.ts';
import type { BulkAddPick } from './BulkAddPick.ts';

type ToBulkAddPickProps = {
  item: BulkAddItem;
  sourceKey: string;
};

export function toBulkAddPick({ item, sourceKey }: ToBulkAddPickProps) {
  return {
    key: item.key,
    type: item.type,
    id: item.id,
    sourceKey,
  } satisfies BulkAddPick;
}
