import { NOOP_FN } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import {
  BehaviorSubject,
  firstValueFrom,
  type Observable,
  Subject,
} from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
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
  const subscriptions: Array<{ unsubscribe: () => void }> = [];

  afterEach(() => {
    subscriptions.splice(0).forEach((subscription) =>
      subscription.unsubscribe()
    );
    vi.useRealTimers();
  });

  function collect<T>(list: Observable<Array<T>>) {
    const emissions: Array<Array<T>> = [];
    subscriptions.push(list.subscribe((value) => emissions.push(value)));

    return () => emissions.at(-1);
  }

  it('should return a store with an empty array', async () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    expect(await firstValueFrom(useStableArray(compareFn, source).list))
      .toEqual(
        [],
      );
  });

  it('should update the store with a new item', () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const latest = collect(useStableArray(compareFn, source).list);

    source.next([item1]);

    expect(latest()).toEqual([item1]);
  });

  it('should update the store with multiple items', () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const latest = collect(useStableArray(compareFn, source).list);
    const items = [item1, item2];

    source.next(items);

    expect(latest()).toEqual(items);
  });

  it('should update the store with the same item', () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const latest = collect(useStableArray(compareFn, source).list);

    source.next([item1]);
    source.next([item1]);

    expect(latest()).toEqual([item1]);
  });

  it('should update the store with the same item with different data', () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const latest = collect(useStableArray(compareFn, source).list);

    const update = { ...item1, title: 'Updated Show 1' };
    source.next([item1]);
    source.next([update]);

    expect(latest()).toEqual([update]);
  });

  it('should update the store with multiple items with the same item', () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const latest = collect(useStableArray(compareFn, source).list);
    const items = [
      item1,
      item1,
      item1,
    ];

    source.next(items);

    expect(latest()).toEqual([item1]);
  });

  it('should insert new item at its server-sorted position when it leads the update', () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const latest = collect(useStableArray(compareFn, source).list);

    source.next([item1, item2]);
    source.next([item3, item1, item2]);

    expect(latest()).toEqual([
      item3,
      item1,
      item2,
    ]);
  });

  it('should insert new item at its server-sorted position when it is in the middle', () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const latest = collect(useStableArray(compareFn, source).list);

    source.next([item1, item3]);
    source.next([item1, item2, item3]);

    expect(latest()).toEqual([
      item1,
      item2,
      item3,
    ]);
  });

  it('should append new item at the end when server places it last', () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const latest = collect(useStableArray(compareFn, source).list);

    source.next([item1, item2]);
    source.next([item1, item2, item3]);

    expect(latest()).toEqual([
      item1,
      item2,
      item3,
    ]);
  });

  it('should remove items that are not in the new list', () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const latest = collect(useStableArray(compareFn, source).list);

    source.next([item1, item2]);
    source.next([item3]);

    expect(latest()).toEqual([item3]);
  });

  it('should keep the order of the items', () => {
    const source = new BehaviorSubject<MockItem[]>([]);
    const latest = collect(useStableArray(compareFn, source).list);
    const update2 = { ...item2, title: 'Updated Show 2' };

    source.next([item1, item2, item3]);
    source.next([update2, item1, item3]);

    expect(latest()).toEqual([item1, update2, item3]);
  });

  it('should not subscribe to the source until the list is subscribed to', () => {
    const source = new Subject<MockItem[]>();

    useStableArray(compareFn, source);

    expect(source.observed).to.equal(false);
  });

  it('should unsubscribe from the source once the last subscriber leaves', async () => {
    vi.useFakeTimers();

    const source = new Subject<MockItem[]>();
    const { list } = useStableArray(compareFn, source);

    const subscription = list.subscribe(NOOP_FN);
    expect(source.observed).to.equal(true);

    subscription.unsubscribe();
    await vi.advanceTimersByTimeAsync(time.seconds(1));

    expect(source.observed).to.equal(false);
  });
});
