import { SentryEndpoint } from '$lib/features/sentry/SentryEndpoint.ts';
import { SENTRY_DSN } from '$lib/utils/constants.ts';
import { parseSentryDsn } from './_internal/parseSentryDsn.ts';
import type { Handle } from '@sveltejs/kit';
import { z } from 'zod';

const ENVELOPE_CONTENT_TYPE = 'application/x-sentry-envelope';

const LINE_FEED = 0x0a;

const MAX_ENVELOPE_BYTES = 4 * 1024 * 1024;

const FORWARDED_RESPONSE_HEADERS: ReadonlyArray<string> = [
  'content-type',
  'retry-after',
  'x-sentry-rate-limits',
];

const EnvelopeHeaderSchema = z.object({
  dsn: z.string(),
});

const INGEST = parseSentryDsn(SENTRY_DSN);

function toEnvelopeDsn(payload: ArrayBuffer): string | null {
  const bytes = new Uint8Array(payload);
  const lineFeedIndex = bytes.indexOf(LINE_FEED);
  const headerBytes = lineFeedIndex === -1
    ? bytes
    : bytes.subarray(0, lineFeedIndex);

  try {
    const header = EnvelopeHeaderSchema.safeParse(
      JSON.parse(new TextDecoder().decode(headerBytes)),
    );

    return header.success ? header.data.dsn : null;
  } catch {
    return null;
  }
}

function isKnownEnvelope(
  payload: ArrayBuffer,
  ingest: NonNullable<typeof INGEST>,
): boolean {
  const envelopeDsn = toEnvelopeDsn(payload);
  const parsed = envelopeDsn ? parseSentryDsn(envelopeDsn) : null;

  return parsed?.host === ingest.host &&
    parsed?.projectId === ingest.projectId;
}

function isOversizedContentLength(contentLength: string | null): boolean {
  if (contentLength === null) {
    return false;
  }

  const size = Number(contentLength);

  return Number.isFinite(size) && size > MAX_ENVELOPE_BYTES;
}

function toForwardedHeaders(headers: Headers): Headers {
  return FORWARDED_RESPONSE_HEADERS.reduce((forwarded, name) => {
    const value = headers.get(name);

    if (value !== null) {
      forwarded.set(name, value);
    }

    return forwarded;
  }, new Headers());
}

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname !== SentryEndpoint.Tunnel) {
    return resolve(event);
  }

  if (event.request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { allow: 'POST' } });
  }

  if (!INGEST) {
    return new Response(null, { status: 500 });
  }

  if (isOversizedContentLength(event.request.headers.get('content-length'))) {
    return new Response(null, { status: 413 });
  }

  const payload = await event.request.arrayBuffer().catch(() => null);

  if (!payload) {
    return new Response(null, { status: 400 });
  }

  if (payload.byteLength > MAX_ENVELOPE_BYTES) {
    return new Response(null, { status: 413 });
  }

  if (!isKnownEnvelope(payload, INGEST)) {
    return new Response(null, { status: 400 });
  }

  const response = await fetch(
    `https://${INGEST.host}/api/${INGEST.projectId}/envelope/`,
    {
      method: 'POST',
      headers: { 'content-type': ENVELOPE_CONTENT_TYPE },
      body: payload,
    },
  ).catch(() => null);

  if (!response) {
    return new Response(null, { status: 502 });
  }

  return new Response(response.body, {
    status: response.status,
    headers: toForwardedHeaders(response.headers),
  });
};
