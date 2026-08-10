import { multicast } from '$lib/utils/store/multicast.ts';
import { type Observable, scan, startWith } from 'rxjs';

export function useStableArray<T>(
  compareFn: (left: T, right: T) => boolean,
  source: Observable<T[]>,
) {
  const updateList = (previous: Array<T>, update: Array<T>) => {
    const updatedList = previous.filter(
      (prevItem) => update.some((newItem) => compareFn(prevItem, newItem)),
    );

    update.forEach((newItem, updateIndex) => {
      const index = updatedList.findIndex((item) => compareFn(item, newItem));
      if (index !== -1) {
        updatedList[index] = newItem;
        return;
      }

      const successor = update
        .slice(updateIndex + 1)
        .find((nextItem) =>
          updatedList.some((item) => compareFn(item, nextItem))
        );

      const insertAt = successor
        ? updatedList.findIndex((item) => compareFn(item, successor))
        : updatedList.length;

      updatedList.splice(insertAt, 0, newItem);
    });

    return updatedList;
  };

  return {
    list: source.pipe(
      scan(updateList, [] as Array<T>),
      startWith([] as Array<T>),
      multicast(),
    ),
  };
}
