import { derived } from 'svelte/store';

export function useStableArray<T>(
  compareFn: (left: T, right: T) => boolean,
  source: ReadableOrObservable<T[]>,
) {
  const updateList = (previous: Array<T>, update: Array<T>) => {
    const updatedList = previous.filter(
      (prevItem) => update.some((newItem) => compareFn(prevItem, newItem)),
    );

    update.forEach((newItem) => {
      const index = updatedList.findIndex((item) => compareFn(item, newItem));
      if (index !== -1) {
        updatedList[index] = newItem;
      } else {
        updatedList.push(newItem);
      }
    });

    return updatedList;
  };

  let previous: Array<T> = [];

  // @ts-expect-error - derived handles interoperable stores
  const list = derived(source, ($source, set) => {
    const updated = updateList(previous, $source);
    previous = updated;
    set(updated);
  }, [] as Array<T>);

  return {
    list,
  };
}
