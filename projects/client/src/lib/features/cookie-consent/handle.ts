import { time } from '$lib/utils/timing/time.ts';
import type { Handle } from '@sveltejs/kit';
import { IS_PROD } from '../../utils/env/index.ts';
import { CookieConsentEndpoint } from './CookieConsentEndpoint.ts';
import { getConsentCookieValue } from './_internal/getConsentCookieValue.ts';
import { COOKIE_CONSENT_COOKIE_NAME } from './constants.ts';

const ROOT_DOMAIN = 'trakt.tv';
const LEGACY_COOKIE_CONSENT_COOKIE_NAME = 'trakt-consent';

function coerceLegacyCookieConsent(
  cookieConsent: string | undefined,
): boolean {
  return JSON.parse(cookieConsent ?? 'false');
}

function coerceCookieConsent(cookieConsent: string | undefined): boolean {
  const cookie = JSON.parse(cookieConsent ?? '{}');
  if (!Array.isArray(cookie.categories)) return false;

  const requiredCategories = ['necessary', 'functionality', 'analytics'];
  return requiredCategories.every((category) =>
    cookie.categories.includes(category)
  );
}

export const handle: Handle = async ({ event, resolve }) => {
  const setCookieConsent = (hasConsent: boolean) => {
    event.locals.hasConsent = hasConsent;
  };

  const hasLegacyConsent = coerceLegacyCookieConsent(
    event.cookies.get(LEGACY_COOKIE_CONSENT_COOKIE_NAME),
  );
  const hasConsent = coerceCookieConsent(
    event.cookies.get(COOKIE_CONSENT_COOKIE_NAME),
  );
  setCookieConsent(hasConsent || hasLegacyConsent);

  if (event.url.pathname.startsWith(CookieConsentEndpoint.Consent)) {
    setCookieConsent(true);

    return new Response(
      null,
      {
        status: 204,
        headers: {
          'Set-Cookie': event.cookies.serialize(
            COOKIE_CONSENT_COOKIE_NAME,
            JSON.stringify(getConsentCookieValue(new Date())),
            {
              httpOnly: false,
              secure: IS_PROD,
              maxAge: time.months(6) / time.seconds(1),
              path: '/',
              domain: IS_PROD ? `.${ROOT_DOMAIN}` : undefined,
            },
          ),
        },
      },
    );
  }

  return await resolve(event);
};
