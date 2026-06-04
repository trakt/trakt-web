import type { ReorderListSource } from '../models/ReorderListSource.ts';
import { useListItems } from '../useListItems.ts';
import { mapListItemToReorderableItem } from './reorderListItems.ts';
import { map } from 'rxjs';

const REORDER_PAGE_SIZE = 100;

export function useReorderList(source: ReorderListSource) {
  const { list, ...rest } = useListItems({
    list: source.list,
    limit: REORDER_PAGE_SIZE,
  });

  return {
    list: list.pipe(
      map((items) => items.map(mapListItemToReorderableItem)),
    ),
    ...rest,
  };
}
