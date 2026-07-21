import { clamp } from '$lib/utils/number/clamp.ts';
import type { ReorderableListItem } from './models/ReorderableListItem.ts';

type MoveReorderableItemProps = {
  items: ReorderableListItem[];
  key: string;
  targetIndex: number;
};

export function moveReorderableItem({
  items,
  key,
  targetIndex,
}: MoveReorderableItemProps): ReorderableListItem[] {
  const item = items.find((entry) => entry.key === key);

  if (item == null) {
    return items;
  }

  const withoutItem = items.filter((entry) => entry.key !== key);
  const index = clamp({ value: targetIndex, min: 0, max: withoutItem.length });

  return [
    ...withoutItem.slice(0, index),
    item,
    ...withoutItem.slice(index),
  ];
}
