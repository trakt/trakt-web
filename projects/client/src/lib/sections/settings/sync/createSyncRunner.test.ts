import { describe, expect, it, vi } from 'vitest';
import { createSyncRunner } from './createSyncRunner.ts';

vi.mock('./retryWithRateLimit.ts', () => ({
  retryWithRateLimit: <T>(fn: () => Promise<T>) => fn(),
}));

const identity = <T>(x: T) => x;
const succeed = () => Promise.resolve('ok');
const fail = (message: string) => () => Promise.reject(new Error(message));

describe('createSyncRunner', () => {
  describe('progress', () => {
    it('calls onProgress with item count after run', async () => {
      const onProgress = vi.fn();
      const { run } = createSyncRunner({ onProgress, onError: vi.fn() });

      await run([[1, 2], [3]], identity, succeed);

      expect(onProgress).toHaveBeenNthCalledWith(1, 2);
      expect(onProgress).toHaveBeenNthCalledWith(2, 3);
    });

    it('accumulates progress count across multiple runs', async () => {
      const onProgress = vi.fn();
      const { run } = createSyncRunner({ onProgress, onError: vi.fn() });

      await run([[1, 2]], identity, succeed);
      await run([[3]], identity, succeed);

      expect(onProgress).toHaveBeenLastCalledWith(3);
    });
  });

  describe('error counting', () => {
    it('getErrorCount returns 0 when no errors occur', async () => {
      const { run, getErrorCount } = createSyncRunner({
        onProgress: vi.fn(),
        onError: vi.fn(),
      });

      await run([[1, 2]], identity, succeed);

      expect(getErrorCount()).toBe(0);
    });

    it('getErrorCount reflects failed items', async () => {
      const { run, getErrorCount } = createSyncRunner({
        onProgress: vi.fn(),
        onError: vi.fn(),
      });

      await run([[1, 2]], identity, fail('error'));

      expect(getErrorCount()).toBe(2);
    });

    it('accumulates error count across multiple runs', async () => {
      const { run, getErrorCount } = createSyncRunner({
        onProgress: vi.fn(),
        onError: vi.fn(),
      });

      await run([[1]], identity, fail('first'));
      await run([[2, 3]], identity, fail('second'));

      expect(getErrorCount()).toBe(3);
    });
  });
});
