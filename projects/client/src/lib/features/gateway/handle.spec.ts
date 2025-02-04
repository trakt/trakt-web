import { AuthMappedMock } from '$mocks/data/auth/AuthMappedMock.ts';
import { mockRequestEvent } from '$test/request/mockRequestEvent.ts';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { handle } from './handle.ts';

describe('handle: gateway', () => {
  const fetch = vi.fn();

  beforeEach(() => {
    fetch.mockClear();
    globalThis.fetch = fetch;
  });

  it('should pass through non-trakt requests', async () => {
    const event = mockRequestEvent({
      url: 'http://localhost',
      request: new Request('http://localhost:3000/_api/other'),
    });
    const resolve = vi.fn();
    await handle({ event, resolve });

    expect(resolve).toHaveBeenCalledWith(event);
  });

  it('should forward trakt requests with correct URL', async () => {
    const event = mockRequestEvent({
      url: 'http://localhost',
      request: new Request('http://localhost:3000/_api/trakt/shows/1'),
    });
    fetch.mockResolvedValueOnce(new Response());
    await handle({ event, resolve: vi.fn() });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({
        method: 'GET',
      }),
    );

    const calledUrl = fetch.mock.calls[0][0];
    expect(calledUrl.toString()).toBe(`${TRAKT_TARGET_ENVIRONMENT}/shows/1`);
  });

  it('should include auth token when available', async () => {
    const event = mockRequestEvent({
      url: 'http://localhost',
      request: new Request('http://localhost:3000/_api/trakt/shows/1'),
    });
    event.locals.auth = AuthMappedMock;
    fetch.mockResolvedValueOnce(new Response());

    await handle({ event, resolve: vi.fn() });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    );

    const headers = fetch.mock.calls[0][1].headers;
    expect(headers.get('Authorization')).toBe(
      `Bearer ${AuthMappedMock.token.access}`,
    );
  });

  it('should NOT include auth token when not available', async () => {
    const event = mockRequestEvent({
      url: 'http://localhost',
      request: new Request('http://localhost:3000/_api/trakt/shows/1'),
    });
    fetch.mockResolvedValueOnce(new Response());

    await handle({ event, resolve: vi.fn() });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    );

    const headers = fetch.mock.calls[0][1].headers;
    expect(headers.get('Authorization')).toBeNull();
  });

  it('should forward POST requests with body', async () => {
    const body = JSON.stringify({ test: 'data' });

    const event = mockRequestEvent({
      url: 'http://localhost',
      request: new Request(
        'http://localhost:3000/_api/trakt/sync/history',
        {
          method: 'POST',
          body,
        },
      ),
    });
    fetch.mockResolvedValueOnce(new Response());

    await handle({ event, resolve: vi.fn() });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({
        method: 'POST',
        body,
      }),
    );
  });

  it('should preserve query parameters', async () => {
    const event = mockRequestEvent({
      url: 'http://localhost',
      request: new Request(
        'http://localhost:3000/_api/trakt/shows/1?query=param',
      ),
    });
    fetch.mockResolvedValueOnce(new Response());

    await handle({ event, resolve: vi.fn() });

    const calledUrl = fetch.mock.calls[0][0];
    expect(calledUrl.searchParams.get('query')).toBe('param');
  });
});
