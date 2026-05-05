import { handle as handleAuth } from '$lib/features/auth/handle.ts';
import { handle as handleBotVerification } from '$lib/features/bot-verification/handle.ts';
import { handle as handleCacheBust } from '$lib/features/cache-bust/handle.ts';
import { handle as handleCookieConsent } from '$lib/features/cookie-consent/handle.ts';
import { handle as handleDeployment } from '$lib/features/deployment/handle.ts';
import { handle as handleDevice } from '$lib/features/devices/handle.ts';
import { handle as handleLocale } from '$lib/features/i18n/handle.ts';
import { handle as handleImage } from '$lib/features/image/handle.ts';
import { handle as handleMobileOperatingSystem } from '$lib/features/mobile-os/handle.ts';
import { handle as handleSearchConfig } from '$lib/features/search/handle.ts';
import { handle as handleTheme } from '$lib/features/theme/handle.ts';
import { isBotAgent } from '$lib/utils/devices/isBotAgent.ts';

import { SENTRY_DSN } from '$lib/utils/constants.ts';
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

export const handleCacheControl: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  if (!response.headers.get('content-type')?.includes('text/html')) {
    return response;
  }

  function toCacheControl() {
    // Verified search engine crawlers (via Cloudflare), full CDN caching for SEO
    if (event.locals.isLegitimateBot) {
      return 'public, max-age=3600, s-maxage=3600';
    }

    // Social bots (Discord, Slack, etc.), "public" so embeds work, but no CDN caching
    if (isBotAgent(event.request.headers.get('user-agent'))) {
      return 'public, max-age=0, must-revalidate';
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

export const handle: Handle = sequence(
  initCloudflareSentryHandle({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.1,
    enableLogs: true,
  }),
  sentryHandle(),
  handleBotVerification,
  handleDevice,
  handleLocale,
  handleTheme,
  handleAuth,
  handleImage,
  handleCacheBust,
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
