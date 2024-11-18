import { ThemeEndpoint } from '$lib/features/theme/ThemeEndpoint.ts';
import { THEME_COOKIE_NAME } from '$lib/features/theme/constants.ts';
import { Theme } from '$lib/features/theme/models/Theme.ts';
import { coerceTheme } from '$lib/features/theme/utils/coerceTheme.ts';
import type { Handle } from '@sveltejs/kit';

const THEME_PLACEHOLDER = '%theme.current%';

export type ThemeResponse = { theme: Theme };

const FIVE_YEARS_IN_SECONDS = 365 * 24 * 60 * 60;

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith(ThemeEndpoint.Set)) {
    const { theme } = await event.request.json() as { theme: Theme };

    return new Response(
      JSON.stringify({ theme }),
      {
        headers: {
          'Set-Cookie': event.cookies.serialize(
            THEME_COOKIE_NAME,
            theme,
            {
              path: '/',
              maxAge: FIVE_YEARS_IN_SECONDS,
            },
          ),
        },
      },
    );
  }

  const { cookies } = event;

  const response = await resolve(
    event,
    {
      transformPageChunk: ({ html }) => {
        const currentTheme = coerceTheme(cookies.get(THEME_COOKIE_NAME));
        return html.replace(THEME_PLACEHOLDER, `${currentTheme}`);
      },
    },
  );

  return response;
};
