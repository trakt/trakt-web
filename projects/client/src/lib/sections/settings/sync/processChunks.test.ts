import { describe, expect, it, vi } from 'vitest';
import { processChunks } from './processChunks.ts';

vi.mock('./retryWithRateLimit.ts', () => ({
  retryWithRateLimit: <T>(fn: () => Promise<T>) => fn(),
}));

const identity = <T>(x: T) => x;
const succeed = <T>(value: T) => () => Promise.resolve(value);
const fail = (message: string) => () => Promise.reject(new Error(message));

describe('processChunks', () => {
  describe('happy path', () => {
    it('returns zero errors when all chunks succeed', async () => {
      const chunks = [[1, 2], [3, 4]];
      const result = await processChunks(
        chunks,
        identity,
        succeed('ok'),
        { onProgress: vi.fn(), onError: vi.fn() },
      );

      expect(result.errors).toBe(0);
    });

    it('returns total processed count', async () => {
      const chunks = [[1, 2], [3, 4]];
      const result = await processChunks(
        chunks,
        identity,
        succeed('ok'),
        { onProgress: vi.fn(), onError: vi.fn() },
      );

      expect(result.processed).toBe(4);
    });

    it('calls onProgress after each chunk with cumulative count', async () => {
      const chunks = [[1, 2], [3]];
      const onProgress = vi.fn();

      await processChunks(chunks, identity, succeed('ok'), {
        onProgress,
        onError: vi.fn(),
      });

      expect(onProgress).toHaveBeenNthCalledWith(1, 2);
      expect(onProgress).toHaveBeenNthCalledWith(2, 3);
    });
  });

  describe('error handling', () => {
    it('counts failed items as errors', async () => {
      const chunks = [[1, 2], [3, 4]];
      const result = await processChunks(
        chunks,
        identity,
        fail('network error'),
        { onProgress: vi.fn(), onError: vi.fn() },
      );

      expect(result.errors).toBe(4);
    });

    it('calls onError with the error message', async () => {
      const chunks = [[1]];
      const onError = vi.fn();

      await processChunks(chunks, identity, fail('something went wrong'), {
        onProgress: vi.fn(),
        onError,
      });

      expect(onError).toHaveBeenCalledWith('something went wrong');
    });

    it('still calls onProgress even when a chunk fails', async () => {
      const chunks = [[1, 2]];
      const onProgress = vi.fn();

      await processChunks(chunks, identity, fail('oops'), {
        onProgress,
        onError: vi.fn(),
      });

      expect(onProgress).toHaveBeenCalledWith(2);
    });

    it('continues processing remaining chunks after a failure', async () => {
      const chunks = [[1], [2], [3]];
      let callCount = 0;
      const sendRequest = () => {
        callCount++;
        return callCount === 2
          ? Promise.reject(new Error('fail'))
          : Promise.resolve('ok');
      };

      const result = await processChunks(chunks, identity, sendRequest, {
        onProgress: vi.fn(),
        onError: vi.fn(),
      });

      expect(result.processed).toBe(3);
      expect(result.errors).toBe(1);
    });
  });

  describe('initialProcessed offset', () => {
    it('starts progress count from initialProcessed', async () => {
      const chunks = [[1, 2]];
      const onProgress = vi.fn();

      await processChunks(
        chunks,
        identity,
        succeed('ok'),
        { onProgress, onError: vi.fn() },
        10,
      );

      expect(onProgress).toHaveBeenCalledWith(12);
    });

    it('includes initialProcessed in the returned processed count', async () => {
      const chunks = [[1, 2]];
      const result = await processChunks(
        chunks,
        identity,
        succeed('ok'),
        { onProgress: vi.fn(), onError: vi.fn() },
        5,
      );

      expect(result.processed).toBe(7);
    });
  });

  describe('edge cases', () => {
    it('returns zero processed and errors for empty chunks', async () => {
      const result = await processChunks(
        [],
        identity,
        succeed('ok'),
        { onProgress: vi.fn(), onError: vi.fn() },
      );

      expect(result).toEqual({ processed: 0, errors: 0 });
    });

    it('passes the built payload to sendRequest', async () => {
      const chunks = [[1, 2]];
      const buildPayload = (batch: ReadonlyArray<number>) =>
        batch.map((n) => n * 2);
      const sendRequest = vi.fn().mockResolvedValue('ok');

      await processChunks(chunks, buildPayload, sendRequest, {
        onProgress: vi.fn(),
        onError: vi.fn(),
      });

      expect(sendRequest).toHaveBeenCalledWith([2, 4]);
    });
  });
});
