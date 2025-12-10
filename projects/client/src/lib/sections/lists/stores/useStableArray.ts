import { toObservable } from '$lib/utils/store/toObservable.ts';
import { scan } from 'rxjs';

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

  const list = toObservable(source).pipe(
    scan((previous, current) => updateList(previous, current), [] as Array<T>),
  );

  return {
    list,
  };
}
