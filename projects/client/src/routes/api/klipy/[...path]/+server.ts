import { klipyApiKeyFromEnv } from '$lib/features/gif-picker/klipyApiKeyFromEnv.ts';
import { time } from '$lib/utils/timing/time.ts';
import { error, type RequestHandler } from '@sveltejs/kit';
import { toKlipyCacheControl } from './_internal/toKlipyCacheControl.ts';
import { toKlipyShareSlug } from './_internal/toKlipyShareSlug.ts';
import { toKlipyUpstreamQuery } from './_internal/toKlipyUpstreamQuery.ts';

const KLIPY_API = 'https://api.klipy.com/api/v1';

// Bound the hop so a hung upstream cannot hold a picker request open.
const REQUEST_TIMEOUT = time.seconds(8);

function apiKey(): string {
  const key = klipyApiKeyFromEnv();

  if (!key) {
    error(503, 'Klipy is not configured');
  }

  return key;
}

export const GET: RequestHandler = async ({ params, url, fetch }) => {
  const path = params.path ?? '';
  const cacheControl = toKlipyCacheControl(path);

  if (cacheControl == null) {
    error(404);
  }

  const response = await fetch(
    `${KLIPY_API}/${apiKey()}/${path}?${toKlipyUpstreamQuery(url)}`,
    { signal: AbortSignal.timeout(REQUEST_TIMEOUT) },
  );

  if (!response.ok) {
    error(response.status === 404 ? 404 : 502, 'Klipy request failed');
  }

  return new Response(await response.text(), {
    headers: {
      'content-type': 'application/json',
      'cache-control': cacheControl,
    },
  });
};

export const POST: RequestHandler = async ({ params, request, fetch }) => {
  const slug = toKlipyShareSlug(params.path ?? '');

  if (slug == null) {
    error(404);
  }

  // Telemetry for Klipy's ranking. The caller never acts on the outcome, so an
  // upstream failure is swallowed rather than surfaced as a failed comment.
  await fetch(`${KLIPY_API}/${apiKey()}/gifs/share/${slug}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: await request.text(),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  }).catch(() => undefined);

  return new Response(null, { status: 204 });
};
