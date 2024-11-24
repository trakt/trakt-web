import { writable } from 'svelte/store';

export function useStableArray<T>(
  compareFn: (left: T, right: T) => boolean,
) {
  const list = writable<Array<T>>([]);

  const set = (update: Array<T>) => {
    list.update((previous) => {
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
    });
  };

  return {
    list,
    set,
  };
}
