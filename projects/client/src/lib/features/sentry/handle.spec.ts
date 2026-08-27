import { SENTRY_DSN } from '$lib/utils/constants.ts';
import { server } from '$mocks/server.ts';
import { mockRequestEvent } from '$test/request/mockRequestEvent.ts';
import type { Handle } from '@sveltejs/kit';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { parseSentryDsn } from './_internal/parseSentryDsn.ts';
import { handle } from './handle.ts';
import { SentryEndpoint } from './SentryEndpoint.ts';

const ingest = parseSentryDsn(SENTRY_DSN);

const INGEST_URL = ingest
  ? `https://${ingest.host}/api/${ingest.projectId}/envelope/`
  : '';

const TUNNEL_URL = `http://localhost${SentryEndpoint.Tunnel}`;

const MAX_ENVELOPE_BYTES = 4 * 1024 * 1024;

function toEnvelope(header: Record<string, unknown>): string {
  return [
    JSON.stringify(header),
    JSON.stringify({ type: 'event' }),
    JSON.stringify({ message: 'tunnel spec' }),
  ].join('\n');
}

function toRequest(
  { body, headers, method = 'POST' }: {
    body?: BodyInit;
    headers?: HeadersInit;
    method?: string;
  },
): Request {
  return new Request(TUNNEL_URL, { method, headers, body });
}

function callHandle(
  request: Request,
  url: string = TUNNEL_URL,
): ReturnType<Handle> {
  const resolve = vi.fn(() => new Response('page'));

  return handle(
    {
      event: mockRequestEvent({ url, request }),
      resolve,
    } as unknown as Parameters<Handle>[0],
  );
}

function serveIngest(
  responder: Parameters<typeof http.post>[1],
): { bodies: string[] } {
  const bodies: string[] = [];

  server.use(
    http.post(INGEST_URL, async (context) => {
      bodies.push(await context.request.text());
      return responder(context);
    }),
  );

  return { bodies };
}

describe('handle: sentry', () => {
  it('should pass unrelated paths through to the next handler', async () => {
    const resolve = vi.fn(() => new Response('page'));

    const response = await handle(
      {
        event: mockRequestEvent({
          url: 'http://localhost/movies/heretic-2024',
          request: new Request('http://localhost/movies/heretic-2024'),
        }),
        resolve,
      } as unknown as Parameters<Handle>[0],
    );

    expect(resolve).toHaveBeenCalledOnce();
    expect(await response.text()).toBe('page');
  });

  it('should reject a non-POST request with 405', async () => {
    const response = await callHandle(toRequest({ method: 'GET' }));

    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('POST');
  });

  it('should relay a known envelope and mirror the ingest status', async () => {
    const { bodies } = serveIngest(() =>
      HttpResponse.json({ id: 'abc' }, { status: 200 })
    );
    const envelope = toEnvelope({ dsn: SENTRY_DSN });

    const response = await callHandle(toRequest({ body: envelope }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: 'abc' });
    expect(bodies).toEqual([envelope]);
  });

  it('should forward the rate limit headers back to the client', async () => {
    serveIngest(() =>
      new HttpResponse(null, {
        status: 429,
        headers: {
          'retry-after': '60',
          'x-sentry-rate-limits': '60:error:organization',
        },
      })
    );

    const response = await callHandle(
      toRequest({ body: toEnvelope({ dsn: SENTRY_DSN }) }),
    );

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('60');
    expect(response.headers.get('x-sentry-rate-limits')).toBe(
      '60:error:organization',
    );
  });

  it('should relay when the request carries no content length', async () => {
    const request = toRequest({ body: toEnvelope({ dsn: SENTRY_DSN }) });

    expect(request.headers.get('content-length')).toBeNull();

    serveIngest(() => HttpResponse.json({ id: 'abc' }));

    const response = await callHandle(request);

    expect(response.status).toBe(200);
  });

  it('should reject an envelope addressed to another host', async () => {
    const response = await callHandle(
      toRequest({
        body: toEnvelope({ dsn: 'https://key@evil.example.com/1' }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it('should reject an envelope addressed to another project', async () => {
    const response = await callHandle(
      toRequest({
        body: toEnvelope({
          dsn: `https://key@${ingest?.host ?? ''}/9999999`,
        }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it('should reject an envelope without a dsn in its header', async () => {
    const response = await callHandle(
      toRequest({ body: toEnvelope({ event_id: 'abc' }) }),
    );

    expect(response.status).toBe(400);
  });

  it('should reject an envelope whose header is not json', async () => {
    const response = await callHandle(toRequest({ body: 'not-an-envelope' }));

    expect(response.status).toBe(400);
  });

  it('should reject a declared content length above the cap', async () => {
    const response = await callHandle(
      toRequest({
        body: toEnvelope({ dsn: SENTRY_DSN }),
        headers: { 'content-length': `${MAX_ENVELOPE_BYTES + 1}` },
      }),
    );

    expect(response.status).toBe(413);
  });

  it('should reject a body above the cap when no content length is declared', async () => {
    const response = await callHandle(
      toRequest({ body: 'x'.repeat(MAX_ENVELOPE_BYTES + 1) }),
    );

    expect(response.status).toBe(413);
  });

  it('should return 502 when the ingest relay fails', async () => {
    serveIngest(() => HttpResponse.error());

    const response = await callHandle(
      toRequest({ body: toEnvelope({ dsn: SENTRY_DSN }) }),
    );

    expect(response.status).toBe(502);
  });
});
