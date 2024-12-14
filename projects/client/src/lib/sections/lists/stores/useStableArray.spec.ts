import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { useStableArray } from '../../lists/stores/useStableArray.ts';

const item1 = {
  show: {
    id: 1,
    title: 'Show 1',
  },
};

const item2 = {
  show: {
    id: 2,
    title: 'Show 2',
  },
};

const item3 = {
  show: {
    id: 3,
    title: 'Show 3',
  },
};

const compareFn = (left: typeof item1, right: typeof item1) =>
  left.show.id === right.show.id;

describe('useStableArray', () => {
  it('should return a store with an empty array', () => {
    expect(get(useStableArray(compareFn).list)).toEqual([]);
  });

  it('should update the store with a new item', () => {
    const store = useStableArray(compareFn);

    store.set([item1]);

    expect(get(store.list)).toEqual([item1]);
  });

  it('should update the store with multiple items', () => {
    const store = useStableArray(compareFn);
    const items = [item1, item2];

    store.set(items);

    expect(get(store.list)).toEqual(items);
  });

  it('should update the store with the same item', () => {
    const store = useStableArray(compareFn);

    store.set([item1]);
    store.set([item1]);

    expect(get(store.list)).toEqual([item1]);
  });

  it('should update the store with the same item with different data', () => {
    const store = useStableArray(compareFn);

    const update = { ...item1, title: 'Updated Show 1' };
    store.set([item1]);
    store.set([update]);

    expect(get(store.list)).toEqual([update]);
  });

  it('should update the store with multiple items with the same item', () => {
    const store = useStableArray(compareFn);
    const items = [
      item1,
      item1,
    ];

    store.set(items);

    expect(get(store.list)).toEqual([item1]);
  });

  it('should add new items at the end of the list', () => {
    const store = useStableArray(compareFn);

    store.set([item1, item2]);
    store.set([item3, item1, item2]);

    expect(get(store.list)).toEqual([item1, item2, item3]);
  });

  it('should remove items that are not in the new list', () => {
    const store = useStableArray(compareFn);

    store.set([item1, item2]);
    store.set([item3]);

    expect(get(store.list)).toEqual([item3]);
  });

  it('should keep the order of the items', () => {
    const store = useStableArray(compareFn);
    const update2 = { ...item2, title: 'Updated Show 2' };

    store.set([item1, item2, item3]);
    store.set([update2, item1, item3]);

    expect(get(store.list)).toEqual([item1, update2, item3]);
  });
});
