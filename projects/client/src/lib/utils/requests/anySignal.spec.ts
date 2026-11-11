import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { anySignal } from './anySignal.ts';

describe('util: anySignal', () => {
  describe('without native AbortSignal.any', () => {
    beforeEach(() => {
      vi.stubGlobal(
        'AbortSignal',
        Object.assign(Object.create(AbortSignal) as typeof AbortSignal, {
          any: undefined,
        }),
      );
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should not abort while no input aborts', () => {
      const signal = anySignal([
        new AbortController().signal,
        new AbortController().signal,
      ]);

      expect(signal.aborted).toBe(false);
    });

    it('should abort with the reason of the first input that aborts', () => {
      const first = new AbortController();
      const second = new AbortController();
      const signal = anySignal([first.signal, second.signal]);

      second.abort('timeout');
      first.abort('cancelled');

      expect(signal.aborted).toBe(true);
      expect(signal.reason).toBe('timeout');
    });

    it('should be aborted when an input is already aborted', () => {
      const aborted = new AbortController();
      aborted.abort('done');

      const signal = anySignal([new AbortController().signal, aborted.signal]);

      expect(signal.aborted).toBe(true);
      expect(signal.reason).toBe('done');
    });
  });

  it('should abort when an input aborts with native support', () => {
    const controller = new AbortController();
    const signal = anySignal([controller.signal]);

    controller.abort('cancelled');

    expect(signal.reason).toBe('cancelled');
  });
});
