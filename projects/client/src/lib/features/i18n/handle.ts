import { LOCALE_COOKIE_NAME } from '$lib/features/i18n/constants.ts';
import {
  type AvailableLocale,
  defaultLocale,
  getPreferredLocale,
  getTextDirection,
  setLocale,
} from '$lib/features/i18n/index.ts';
import { LocaleEndpoint } from '$lib/features/i18n/LocaleEndpoint.ts';
import { overwriteServerAsyncLocalStorage } from '$lib/paraglide/runtime.js';
import { isBotAgent } from '$lib/utils/devices/isBotAgent.ts';
import { time } from '$lib/utils/timing/time.ts';
import { AsyncLocalStorage } from 'node:async_hooks';
import type { Handle } from '@sveltejs/kit';

export const LANG_PLACEHOLDER = '"%paraglide.lang%"';
export const DIR_PLACEHOLDER = '"%paraglide.textDirection%"';

// Cloudflare reuses one isolate across concurrent requests, so paraglide's
// `globalVariable` strategy leaks one request's locale into another's SSR
// render. Per-request AsyncLocalStorage isolates the locale; `getLocale()`
// reads the store before falling back to the shared global.
const localeStorage = new AsyncLocalStorage<{
  locale?: AvailableLocale;
  origin?: string;
  messageCalls?: Set<string>;
}>();
overwriteServerAsyncLocalStorage(localeStorage);

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith(LocaleEndpoint.Set)) {
    const { locale } = await event.request.json() as {
      locale: string;
    };

    const sanitizedLocale = setLocale(locale as AvailableLocale);

    return new Response(sanitizedLocale, {
      headers: {
        'Set-Cookie': event.cookies.serialize(
          LOCALE_COOKIE_NAME,
          sanitizedLocale,
          {
            httpOnly: true,
            secure: true,
            maxAge: time.years(5) / time.seconds(1),
            path: '/',
          },
        ),
      },
    });
  }

  // Bot responses are publicly cached (see handleCacheControl) under a
  // locale-blind cache key, so a localized render would be served to every
  // subsequent visitor on that URL. Pin bots to the default locale to keep
  // cached HTML neutral.
  const isCacheableBot = event.locals.isLegitimateBot ||
    isBotAgent(event.request.headers.get('user-agent'));

  const requestedLocale = event.cookies.get(LOCALE_COOKIE_NAME) ??
    getPreferredLocale(event.request.headers);
  const locale = setLocale(isCacheableBot ? defaultLocale : requestedLocale);
  const direction = getTextDirection(locale);

  return localeStorage.run({ locale }, () =>
    resolve(event, {
      transformPageChunk({ html, done }) {
        if (!done) return html;
        return html
          .replace(LANG_PLACEHOLDER, locale)
          .replace(DIR_PLACEHOLDER, direction);
      },
    }));
};
