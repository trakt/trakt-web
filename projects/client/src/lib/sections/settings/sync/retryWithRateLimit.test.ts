import { describe, expect, it, vi } from 'vitest';
import { retryWithRateLimit } from './retryWithRateLimit.ts';

vi.mock('$lib/utils/retry/retryDelay.ts', () => ({ retryDelay: () => 0 }));

const respond = (status: number, headers: Record<string, string> = {}) => ({
  status,
  body: undefined,
  headers: new Headers(headers),
});

describe('retryWithRateLimit', () => {
  it('returns a 2xx response untouched', async () => {
    const response = respond(201);

    await expect(
      retryWithRateLimit(() => Promise.resolve(response)),
    ).resolves.toBe(response);
  });

  it('retries a 429 response after its Retry-After delay', async () => {
    const fn = vi
      .fn<() => Promise<ReturnType<typeof respond>>>()
      .mockResolvedValueOnce(respond(429, { 'Retry-After': '0' }))
      .mockResolvedValueOnce(respond(201));

    const result = await retryWithRateLimit(fn);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(result.status).toBe(201);
  });

  it('rejects once a non 2xx status survives every retry', async () => {
    const fn = vi.fn().mockResolvedValue(respond(420));

    await expect(retryWithRateLimit(fn)).rejects.toThrow(
      'Request failed with status 420',
    );
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('passes values without a status through', async () => {
    await expect(retryWithRateLimit(() => Promise.resolve('ok'))).resolves.toBe(
      'ok',
    );
  });

  it('should stop retrying when the import is aborted during a Retry-After wait', async () => {
    const controller = new AbortController();
    const fn = vi
      .fn<() => Promise<ReturnType<typeof respond>>>()
      .mockResolvedValue(respond(429, { 'Retry-After': '60' }));

    const result = retryWithRateLimit(fn, controller.signal);
    await vi.waitFor(() => expect(fn).toHaveBeenCalledTimes(1));
    controller.abort();

    await expect(result).rejects.toBeDefined();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
