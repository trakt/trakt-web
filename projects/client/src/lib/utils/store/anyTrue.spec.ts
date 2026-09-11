import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { anyTrue } from './anyTrue.ts';

describe('util: anyTrue', () => {
  it('should be false without sources', async () => {
    expect(await firstValueFrom(anyTrue([]))).toBe(false);
  });

  it('should be false while every source is false', async () => {
    const sources = [new BehaviorSubject(false), new BehaviorSubject(false)];

    expect(await firstValueFrom(anyTrue(sources))).toBe(false);
  });

  it('should be true while any source is true', async () => {
    const sources = [new BehaviorSubject(false), new BehaviorSubject(true)];

    expect(await firstValueFrom(anyTrue(sources))).toBe(true);
  });

  it('should follow a source flipping back to false', () => {
    const source = new BehaviorSubject(true);
    const states: boolean[] = [];

    const subscription = anyTrue([source, new BehaviorSubject(false)])
      .subscribe((value) => states.push(value));
    source.next(false);
    subscription.unsubscribe();

    expect(states).to.deep.equal([true, false]);
  });
});
