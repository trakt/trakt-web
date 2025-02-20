import { type Writable, writable } from 'svelte/store';

export type Identity = string | number;

export type OrderedArrayOptions<T> = {
  getId: (item: T) => Identity;
  order?: Identity[];
};

export function useOrderedArray<T>(
  { getId, order: initialOrder }: OrderedArrayOptions<T>,
) {
  const list: Writable<Array<T>> = writable([]);

  const set = (update: Array<T>, newOrder?: Identity[]) => {
    if (update.length === 0) {
      list.set([]);
      return;
    }

    const orderToUse = newOrder ?? initialOrder;
    if (!orderToUse) {
      list.set(update);
      return;
    }

    const itemMap = new Map(
      update.map((item) => [getId(item), item]),
    );

    const orderedItems = orderToUse
      .map((id) => itemMap.get(id))
      .filter((item): item is T => item !== undefined);

    const newItems = update.filter(
      (item) => !orderToUse.includes(getId(item)),
    );

    const finalList = [...orderedItems, ...newItems];

    list.set(finalList);
  };

  return {
    list,
    set,
  };
}
