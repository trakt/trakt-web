import { LOCALE_COOKIE_NAME } from '$lib/features/i18n/constants.ts';
import {
  type AvailableLocale,
  getTextDirection,
  setLocale,
} from '$lib/features/i18n/index.ts';
import { LocaleEndpoint } from '$lib/features/i18n/LocaleEndpoint.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { Handle } from '@sveltejs/kit';

const LANG_PLACEHOLDER = '"%paraglide.lang%"';
const DIR_PLACEHOLDER = '"%paraglide.textDirection%"';

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

  const locale = setLocale(event.cookies.get(LOCALE_COOKIE_NAME) ?? '');
  const direction = getTextDirection(locale);

  return resolve(event, {
    transformPageChunk({ html, done }) {
      if (!done) return html;
      return html
        .replace(LANG_PLACEHOLDER, locale)
        .replace(DIR_PLACEHOLDER, direction);
    },
  });
};
