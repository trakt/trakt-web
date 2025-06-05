import { time } from '$lib/utils/timing/time.ts';
import type { Handle } from '@sveltejs/kit';
import { CookieConsentEndpoint } from './CookieConsentEndpoint.ts';
import { COOKIE_CONSENT_COOKIE_NAME } from './constants.ts';

function coerceCookieConsent(
  cookieConsent: string | undefined,
): boolean {
  return JSON.parse(cookieConsent ?? 'false');
}

export const handle: Handle = async ({ event, resolve }) => {
  const setCookieConsent = (hasConsent: boolean) => {
    event.locals.hasConsent = hasConsent;
  };

  setCookieConsent(
    coerceCookieConsent(event.cookies.get(COOKIE_CONSENT_COOKIE_NAME)),
  );

  if (event.url.pathname.startsWith(CookieConsentEndpoint.Consent)) {
    setCookieConsent(true);

    return new Response(
      null,
      {
        status: 204,
        headers: {
          'Set-Cookie': event.cookies.serialize(
            COOKIE_CONSENT_COOKIE_NAME,
            'true',
            {
              httpOnly: true,
              secure: true,
              maxAge: time.months(6) / time.seconds(1),
              path: '/',
            },
          ),
        },
      },
    );
  }

  return await resolve(event);
};
