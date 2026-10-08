import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { typeLines } from './typeLines.ts';

describe('util: typeLines', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('should emit each frame after the previous wait', () => {
    const emitted: Array<ReadonlyArray<string>> = [];
    const onComplete = vi.fn();

    typeLines([
      { typed: ['H'], wait: 10 },
      { typed: ['Hi'], wait: 100 },
    ]).subscribe({
      next: (typed) => emitted.push(typed),
      complete: onComplete,
    });

    expect(emitted).toEqual([['H']]);

    vi.advanceTimersByTime(10);
    expect(emitted).toEqual([['H'], ['Hi']]);
    expect(onComplete).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('should not complete once unsubscribed', () => {
    const onComplete = vi.fn();

    typeLines([{ typed: ['H'], wait: 10 }])
      .subscribe({ complete: onComplete })
      .unsubscribe();

    vi.advanceTimersByTime(10);
    expect(onComplete).not.toHaveBeenCalled();
  });
});
