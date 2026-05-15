import { describe, expect, it } from 'vitest';
import { toObservable } from './toObservable.ts';

function mockWritable<T>(initial: T) {
  let value = initial;
  const subscribers = new Set<(val: T) => void>();

  return {
    subscribe(run: (val: T) => void) {
      run(value);
      subscribers.add(run);
      return () => subscribers.delete(run);
    },
    set(newValue: T) {
      value = newValue;
      subscribers.forEach((run) => run(value));
    },
  };
}

const flushMicrotasks = () =>
  new Promise<void>((resolve) => queueMicrotask(resolve));

describe('toObservable', () => {
  it('should emit initial value synchronously from readable store', () => {
    const store = mockWritable('initial');
    const observable = toObservable(store);
    let emittedValue: string | undefined;

    const subscription = observable.subscribe((value) => {
      emittedValue = value;
    });

    expect(emittedValue).toBe('initial');
    subscription.unsubscribe();
  });

  it('should emit updated values from writable store (deferred)', async () => {
    const store = mockWritable('initial');
    const observable = toObservable(store);
    const emittedValues: string[] = [];

    const subscription = observable.subscribe((value) => {
      emittedValues.push(value);
    });

    store.set('updated');
    store.set('final');
    await flushMicrotasks();

    expect(emittedValues).toEqual(['initial', 'updated', 'final']);
    subscription.unsubscribe();
  });

  it('should handle multiple subscribers independently', async () => {
    const store = mockWritable(1);
    const observable = toObservable(store);
    const values1: number[] = [];
    const values2: number[] = [];

    const sub1 = observable.subscribe((value) => values1.push(value));
    const sub2 = observable.subscribe((value) => values2.push(value));

    store.set(2);
    store.set(3);
    await flushMicrotasks();

    expect(values1).toEqual([1, 2, 3]);
    expect(values2).toEqual([1, 2, 3]);

    sub1.unsubscribe();
    sub2.unsubscribe();
  });

  it('should stop emitting after unsubscription', async () => {
    const store = mockWritable('start');
    const observable = toObservable(store);
    const emittedValues: string[] = [];

    const subscription = observable.subscribe((value) => {
      emittedValues.push(value);
    });

    store.set('middle');
    // Flush so the deferred 'middle' lands before we unsubscribe;
    // anything emitted after unsubscribe must not be delivered.
    await flushMicrotasks();
    subscription.unsubscribe();
    store.set('end');
    await flushMicrotasks();

    expect(emittedValues).toEqual(['start', 'middle']);
  });

  it('should work with different types', () => {
    const store = mockWritable<number[]>([1, 2, 3]);
    const observable = toObservable(store);
    let emittedValue: number[] | undefined;

    const subscription = observable.subscribe((value) => {
      emittedValue = value;
    });

    expect(emittedValue).toEqual([1, 2, 3]);
    subscription.unsubscribe();
  });
});
