import { afterEach, describe, expect, it, vi } from 'vitest';
import { startShowRewatchingRequest } from './startShowRewatchingRequest.ts';
import { stopShowRewatchingRequest } from './stopShowRewatchingRequest.ts';

describe('show rewatching requests', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start a rewatch session three minutes before now', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-18T12:00:00.000Z'));

    const fetch = vi.fn(() =>
      Promise.resolve(new Response(null, { status: 204 }))
    ) as unknown as typeof globalThis.fetch;

    const result = await startShowRewatchingRequest({
      fetch,
      id: 123,
    });

    expect(result).to.equal(true);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost/shows/123/progress/watched/reset',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ reset_at: '2026-06-18T11:57:00.000Z' }),
      }),
    );
  });

  it('should stop a rewatch session', async () => {
    const fetch = vi.fn(() =>
      Promise.resolve(new Response(null, { status: 204 }))
    ) as unknown as typeof globalThis.fetch;

    const result = await stopShowRewatchingRequest({
      fetch,
      id: 123,
    });

    expect(result).to.equal(true);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost/shows/123/progress/watched/reset',
      expect.objectContaining({
        method: 'DELETE',
      }),
    );
  });
});
