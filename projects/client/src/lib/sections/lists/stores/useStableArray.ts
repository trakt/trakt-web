import { BehaviorSubject, type Observable } from 'rxjs';

export function useStableArray<T>(
  compareFn: (left: T, right: T) => boolean,
  source: Observable<T[]>,
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

  const list = new BehaviorSubject<T[]>([]);
  let previous: Array<T> = [];

  source.subscribe({
    next: (update) => {
      const updated = updateList(previous, update);
      previous = updated;
      list.next(updated);
    },
    error: (err) => list.error(err),
    complete: () => list.complete(),
  });

  return {
    list: list.asObservable(),
  };
}
