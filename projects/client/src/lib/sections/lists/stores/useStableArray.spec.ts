import { get, writable } from 'svelte/store';
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
  it('should return a store with an empty array', () => {
    const source = writable([]);
    expect(get(useStableArray(compareFn, source).list)).toEqual([]);
  });

  it('should update the store with a new item', () => {
    const source = writable<MockItem[]>([]);
    const store = useStableArray(compareFn, source);

    source.set([item1]);

    expect(get(store.list)).toEqual([item1]);
  });

  it('should update the store with multiple items', () => {
    const source = writable<MockItem[]>([]);
    const store = useStableArray(compareFn, source);
    const items = [item1, item2];

    source.set(items);

    expect(get(store.list)).toEqual(items);
  });

  it('should update the store with the same item', () => {
    const source = writable<MockItem[]>([]);
    const store = useStableArray(compareFn, source);

    source.set([item1]);
    source.set([item1]);

    expect(get(store.list)).toEqual([item1]);
  });

  it('should update the store with the same item with different data', () => {
    const source = writable<MockItem[]>([]);
    const store = useStableArray(compareFn, source);

    const update = { ...item1, title: 'Updated Show 1' };
    source.set([item1]);
    source.set([update]);

    expect(get(store.list)).toEqual([update]);
  });

  it('should update the store with multiple items with the same item', () => {
    const source = writable<MockItem[]>([]);
    const store = useStableArray(compareFn, source);
    const items = [
      item1,
      item1,
    ];

    source.set(items);

    expect(get(store.list)).toEqual([item1]);
  });

  it('should add new items at the end of the list', () => {
    const source = writable<MockItem[]>([]);
    const store = useStableArray(compareFn, source);
    const unsubscribe = store.list.subscribe(() => {});

    source.set([item1, item2]);
    source.set([item3, item1, item2]);

    expect(get(store.list)).toEqual([item1, item2, item3]);
    unsubscribe();
  });

  it('should remove items that are not in the new list', () => {
    const source = writable<MockItem[]>([]);
    const store = useStableArray(compareFn, source);

    source.set([item1, item2]);
    source.set([item3]);

    expect(get(store.list)).toEqual([item3]);
  });

  it('should keep the order of the items', () => {
    const source = writable<MockItem[]>([]);
    const store = useStableArray(compareFn, source);
    const update2 = { ...item2, title: 'Updated Show 2' };

    const unsubscribe = store.list.subscribe(() => {});

    source.set([item1, item2, item3]);
    source.set([update2, item1, item3]);

    expect(get(store.list)).toEqual([item1, update2, item3]);
    unsubscribe();
  });
});
