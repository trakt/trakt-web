import { BehaviorSubject, firstValueFrom, lastValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { useStableArray } from './useStableArray.ts';

type MockItem = {
  show: {
    id: number;
    title: string;
  };
};

const item1: MockItem = {
  show: {
    id: 1,
    title: 'Show 1',
  },
};

const item2: MockItem = {
  show: {
    id: 2,
    title: 'Show 2',
  },
};

const item3: MockItem = {
  show: {
    id: 3,
    title: 'Show 3',
  },
};

const compareFn = (left: typeof item1, right: typeof item1) =>
  left.show.id === right.show.id;

describe('useStableArray', () => {
  it('should return a store with an empty array', async () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    expect(await firstValueFrom(useStableArray(compareFn, source).list))
      .toEqual(
        [],
      );
  });

  it('should update the store with a new item', async () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const store = useStableArray(compareFn, source);

    source.next([item1]);

    expect(await firstValueFrom(store.list)).toEqual([item1]);
  });

  it('should update the store with multiple items', async () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const store = useStableArray(compareFn, source);
    const items = [item1, item2];

    source.next(items);

    expect(await firstValueFrom(store.list)).toEqual(items);
  });

  it('should update the store with the same item', async () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const store = useStableArray(compareFn, source);

    source.next([item1]);
    source.next([item1]);

    expect(await firstValueFrom(store.list)).toEqual([item1]);
  });

  it('should update the store with the same item with different data', async () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const store = useStableArray(compareFn, source);

    const update = { ...item1, title: 'Updated Show 1' };
    source.next([item1]);
    source.next([update]);

    expect(await firstValueFrom(store.list)).toEqual([update]);
  });

  it('should update the store with multiple items with the same item', async () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const store = useStableArray(compareFn, source);
    const items = [
      item1,
      item1,
      item1,
    ];

    source.next(items);

    expect(await firstValueFrom(store.list)).toEqual([item1]);
  });

  it('should add new items at the end of the list', async () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const store = useStableArray(compareFn, source);

    source.next([item1, item2]);
    source.next([item3, item1, item2]);

    queueMicrotask(() => source.complete());
    expect(await lastValueFrom(store.list, { defaultValue: [] })).toEqual([
      item1,
      item2,
      item3,
    ]);
  });

  it('should remove items that are not in the new list', async () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const store = useStableArray(compareFn, source);

    source.next([item1, item2]);
    source.next([item3]);

    expect(await firstValueFrom(store.list)).toEqual([item3]);
  });

  it('should keep the order of the items', async () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const store = useStableArray(compareFn, source);
    const update2 = { ...item2, title: 'Updated Show 2' };

    source.next([item1, item2, item3]);
    source.next([update2, item1, item3]);

    queueMicrotask(() => source.complete());
    expect(await lastValueFrom(store.list)).toEqual([item1, update2, item3]);
  });
});
