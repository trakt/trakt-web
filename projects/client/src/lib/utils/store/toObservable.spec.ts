import { BehaviorSubject, Subject } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { toObservable } from './toObservable.ts';

describe('toObservable', () => {
  it('should emit initial value from store-like object', () => {
    const store = {
      subscribe: (cb: (val: string) => void) => {
        cb('initial');
        return () => {};
      },
    };
    const observable = toObservable(store as any);
    let emittedValue: string | undefined;

    const subscription = observable.subscribe((value) => {
      emittedValue = value;
    });

    expect(emittedValue).toBe('initial');
    subscription.unsubscribe();
  });

  it('should emit updated values from BehaviorSubject (simulating writable)', () => {
    const subject = new BehaviorSubject('initial');
    const observable = toObservable(subject);
    const emittedValues: string[] = [];

    const subscription = observable.subscribe((value) => {
      emittedValues.push(value);
    });

    subject.next('updated');
    subject.next('final');

    expect(emittedValues).toEqual(['initial', 'updated', 'final']);
    subscription.unsubscribe();
  });

  it('should handle multiple subscribers independently', () => {
    const subject = new BehaviorSubject(1);
    const observable = toObservable(subject);
    const values1: number[] = [];
    const values2: number[] = [];

    const sub1 = observable.subscribe((value) => values1.push(value));
    const sub2 = observable.subscribe((value) => values2.push(value));

    subject.next(2);
    subject.next(3);

    expect(values1).toEqual([1, 2, 3]);
    expect(values2).toEqual([1, 2, 3]);

    sub1.unsubscribe();
    sub2.unsubscribe();
  });

  it('should stop emitting after unsubscription', () => {
    const subject = new BehaviorSubject('start');
    const observable = toObservable(subject);
    const emittedValues: string[] = [];

    const subscription = observable.subscribe((value) => {
      emittedValues.push(value);
    });

    subject.next('middle');
    subscription.unsubscribe();
    subject.next('end');

    expect(emittedValues).toEqual(['start', 'middle']);
  });

  it('should work with different types', () => {
    const subject = new BehaviorSubject([1, 2, 3]);
    const observable = toObservable(subject);
    let emittedValue: number[] | undefined;

    const subscription = observable.subscribe((value) => {
      emittedValue = value;
    });

    expect(emittedValue).toEqual([1, 2, 3]);
    subscription.unsubscribe();
  });

  it('should return the same observable if input is already an observable', () => {
    const subject = new Subject<string>();
    const observable = toObservable(subject);
    expect(observable).toBe(subject);
  });
});
