import { ClientEnvironment } from '$lib/requests/ClientEnvironment.ts';
import { IS_DEV, IS_PREVIEW } from '$lib/utils/env/index.ts';
import type { HandleFetch } from '@sveltejs/kit';

const PROXY_PREFIX = ClientEnvironment.development;

function toDirectApiUrl(url: URL): string {
  return `${TRAKT_TARGET_ENVIRONMENT}${url.pathname.slice(PROXY_PREFIX.length)}${url.search}`;
}

function withVisitorAgent(request: Request, agent: string | null): Request {
  const headers = new Headers(request.headers);
  if (agent) headers.set('user-agent', agent);
  return new Request(request, { headers });
}

export const handleFetch: HandleFetch = ({ event, request, fetch }) => {
  if (!IS_DEV && !IS_PREVIEW) return fetch(request);

  const url = new URL(request.url);
  const isProxiedApiCall =
    url.origin === event.url.origin && url.pathname.startsWith(PROXY_PREFIX);

  if (!isProxiedApiCall) return fetch(request);

  const direct = new Request(toDirectApiUrl(url), request);
  return fetch(
    withVisitorAgent(direct, event.request.headers.get('user-agent')),
  );
};
