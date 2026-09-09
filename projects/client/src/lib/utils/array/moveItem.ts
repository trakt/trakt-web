import { clamp } from '$lib/utils/number/clamp.ts';

type MoveItemProps<T> = {
  items: ReadonlyArray<T>;
  from: number;
  to: number;
};

/**
 * Moves one entry to another position, keeping every other entry in order.
 * Both indexes are clamped, so a drag that ends outside the row settles at the
 * nearest end rather than dropping the entry.
 */
export function moveItem<T>({ items, from, to }: MoveItemProps<T>): T[] {
  const source = clamp({ value: from, min: 0, max: items.length - 1 });

  if (items.length === 0) {
    return [];
  }

  const moved = items[source] as T;
  const rest = items.filter((_, index) => index !== source);
  const target = clamp({ value: to, min: 0, max: rest.length });

  return [...rest.slice(0, target), moved, ...rest.slice(target)];
}
