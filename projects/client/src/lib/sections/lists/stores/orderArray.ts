import { type OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export type Identity = string | number;

export type OrderedArrayOptions<T> = {
  getId: (item: T) => Identity;
  order?: Identity[];
};

/**
 * RxJS operator that orders an array based on a provided order array.
 * Items not in the order array are appended at the end.
 */
export function orderArray<T>(
  getId: (item: T) => Identity,
  order?: Identity[],
): OperatorFunction<Array<T>, Array<T>> {
  return map((items: Array<T>) => {
    if (items.length === 0 || !order) {
      return items;
    }

    const itemMap = new Map(
      items.map((item) => [getId(item), item]),
    );

    const orderedItems = order
      .map((id) => itemMap.get(id))
      .filter((item): item is T => item !== undefined);

    const newItems = items.filter(
      (item) => !order.includes(getId(item)),
    );

    return [...orderedItems, ...newItems];
  });
}
