import '$lib/polyfills/mapGroupBy.ts';
import { handle as handleAssetFallback } from '$lib/features/asset-fallback/handle.ts';
import { handle as handleAuth } from '$lib/features/auth/handle.ts';
import { handle as handleBotVerification } from '$lib/features/bot-verification/handle.ts';
import { resolveCacheControl } from '$lib/features/cache-control/resolveCacheControl.ts';
import { handle as handleDeployment } from '$lib/features/deployment/handle.ts';
import { handle as handleDevice } from '$lib/features/devices/handle.ts';
import { handle as handleLocale } from '$lib/features/i18n/handle.ts';
import { handle as handleImage } from '$lib/features/image/handle.ts';
import { handle as handleLegacyRedirect } from '$lib/features/legacy-redirects/handle.ts';
import { handle as handleMobileOperatingSystem } from '$lib/features/mobile-os/handle.ts';
import { handle as handleSearchConfig } from '$lib/features/search/handle.ts';
import { handle as handleSentryTunnel } from '$lib/features/sentry/handle.ts';
import { handle as handleTheme } from '$lib/features/theme/handle.ts';
import { hasAuthSession } from '$lib/features/auth/hasAuthSession.ts';
import { isBotAgent } from '$lib/utils/devices/isBotAgent.ts';

import { SENTRY_DSN } from '$lib/utils/constants.ts';
import { stripWebviewParams } from '$lib/utils/url/stripWebviewParams.ts';
import { WEBVIEW_PARAMS } from '$lib/utils/url/webviewParams.ts';
import {
  handleErrorWithSentry,
  initCloudflareSentryHandle,
  sentryHandle,
} from '@sentry/sveltekit';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const WHITELISTED_HEADERS = new Set([
  'content-type',
  'x-pagination-page',
  'x-pagination-page-count',
]);

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

function hasWebviewParam(url: URL): boolean {
  return Object.values(WEBVIEW_PARAMS).some((param) =>
    url.searchParams.has(param)
  );
}

// The slurm VIP token rides the URL on WebView entry. A strict referrer policy
// stops the browser leaking it in a Referer header on the same-origin
// subresources the page fires before captureWebviewSession strips the URL
// (the browser default keeps the full URL, query included, for same-origin).
// strict-origin keeps the bare origin so analytics still works, but drops the
// path and query that carry the token.
export const handleReferrerPolicy: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  if (hasWebviewParam(event.url)) {
    response.headers.set('Referrer-Policy', 'strict-origin');
  }

  return response;
};

export const handleCacheControl: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  const isHtml = response.headers.get('content-type')?.includes('text/html') ??
    false;
  const isRedirect = REDIRECT_STATUSES.has(response.status);

  if (!isHtml && !isRedirect) {
    return response;
  }

  const clonedHeaders = new Headers(response.headers);
  const cacheControl = resolveCacheControl({
    pathname: event.url.pathname,
    isRedirect,
    hasWebviewParam: hasWebviewParam(event.url),
    isLegitimateBot: event.locals.isLegitimateBot,
    isSocialBot: isBotAgent(event.request.headers.get('user-agent')),
    hasSession: hasAuthSession(event.locals.oidcAuth),
  });
  clonedHeaders.set('Cache-Control', cacheControl);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: clonedHeaders,
  });
};

// Keep the slurm VIP token out of Sentry. The client strips the WebView params
// before anything reads them, but the server request URL still carries them, so
// scrub the request URL from every error and transaction report.
function scrubWebviewParams<T extends { request?: { url?: string } }>(
  event: T,
): T {
  const request = event.request;
  if (!request?.url) {
    return event;
  }

  try {
    request.url = stripWebviewParams(new URL(request.url)).href;
  } catch {
    // Leave a non-absolute / unparseable URL untouched.
  }

  return event;
}

export const handle: Handle = sequence(
  initCloudflareSentryHandle({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.1,
    enableLogs: true,
    ignoreErrors: [
      // Client disconnected mid-request; the worker has nothing to do.
      // Cloudflare surfaces this as "Network connection lost." against
      // whichever subrequest or body-read was in flight.
      'Network connection lost.',
    ],
    beforeSend: scrubWebviewParams,
    beforeSendTransaction: scrubWebviewParams,
  }),
  handleSentryTunnel,
  sentryHandle(),
  // Retire legacy trakt.tv paths with a 301 before any routing/auth/i18n work.
  handleLegacyRedirect,
  // Must run before any feature that touches `event.locals` or session
  // state so missing-asset requests (which carry no user context) skip the
  // rest of the pipeline entirely.
  handleAssetFallback,
  handleBotVerification,
  handleDevice,
  handleLocale,
  handleTheme,
  handleAuth,
  handleImage,
  handleReferrerPolicy,
  ({ event, resolve }) => {
    return resolve(event, {
      filterSerializedResponseHeaders: (name) => WHITELISTED_HEADERS.has(name),
    });
  },
  handleCacheControl,
  handleMobileOperatingSystem,
  handleDeployment,
  handleSearchConfig,
);

export const handleError = handleErrorWithSentry();
