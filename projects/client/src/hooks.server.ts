import '$lib/polyfills/mapGroupBy.ts';
import { handle as handleAssetFallback } from '$lib/features/asset-fallback/handle.ts';
import { handle as handleAuth } from '$lib/features/auth/handle.ts';
import { handle as handleBotVerification } from '$lib/features/bot-verification/handle.ts';
import { handle as handleCacheBust } from '$lib/features/cache-bust/handle.ts';
import { handle as handleCookieConsent } from '$lib/features/cookie-consent/handle.ts';
import { handle as handleDeployment } from '$lib/features/deployment/handle.ts';
import { handle as handleDevice } from '$lib/features/devices/handle.ts';
import { handle as handleLocale } from '$lib/features/i18n/handle.ts';
import { handle as handleImage } from '$lib/features/image/handle.ts';
import { handle as handleLegacyRedirect } from '$lib/features/legacy-redirects/handle.ts';
import { handle as handleMobileOperatingSystem } from '$lib/features/mobile-os/handle.ts';
import { handle as handleSearchConfig } from '$lib/features/search/handle.ts';
import { handle as handleTheme } from '$lib/features/theme/handle.ts';
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

  if (!response.headers.get('content-type')?.includes('text/html')) {
    return response;
  }

  function toCacheControl() {
    // A WebView request carries the viewer's VIP token in the URL. Never let a
    // spoofed bot User-Agent promote the response to a public CDN entry (keyed
    // by the token), which would cache one viewer's review for others.
    if (hasWebviewParam(event.url)) {
      return 'private, no-store, no-cache, must-revalidate';
    }

    // Verified search engine crawlers (via Cloudflare), full CDN caching for SEO
    if (event.locals.isLegitimateBot) {
      return 'public, max-age=3600, s-maxage=3600';
    }

    // Social bots (Discord, Slack, etc.), allow a short cache so strict crawlers (Discord) will render embeds
    // Only cache publicly for unauthenticated requests to prevent cache poisoning via spoofed User-Agent
    if (
      isBotAgent(event.request.headers.get('user-agent')) &&
      !event.locals.oidcAuth
    ) {
      // 120 seconds is enough to satisfy Discord without heavily caching stale content
      return 'public, max-age=120, s-maxage=120';
    }

    return 'private, no-store, no-cache, must-revalidate';
  }

  const clonedHeaders = new Headers(response.headers);
  const cacheControl = toCacheControl();
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
  handleCacheBust,
  handleReferrerPolicy,
  ({ event, resolve }) => {
    return resolve(event, {
      filterSerializedResponseHeaders: (name) => WHITELISTED_HEADERS.has(name),
    });
  },
  handleCacheControl,
  handleMobileOperatingSystem,
  handleDeployment,
  handleCookieConsent,
  handleSearchConfig,
);

export const handleError = handleErrorWithSentry();
