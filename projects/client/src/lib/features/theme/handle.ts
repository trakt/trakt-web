import { ThemeEndpoint } from '$lib/features/theme/ThemeEndpoint.ts';
import { THEME_COOKIE_NAME } from '$lib/features/theme/constants.ts';
import { Theme } from '$lib/features/theme/models/Theme.ts';
import { coerceTheme } from '$lib/features/theme/utils/coerceTheme.ts';
import { getDeviceType } from '$lib/utils/devices/getDeviceType.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { Handle } from '@sveltejs/kit';

export const THEME_PLACEHOLDER = '%theme.current%';
export const THEME_SCOPE_PLACEHOLDER = '%theme.seasonal%';

export type ThemeResponse = { theme: Theme };

export const handle: Handle = async ({ event, resolve }) => {
  const setTheme = (theme: Theme) => {
    event.locals.theme = theme;
  };

  setTheme(coerceTheme(event.cookies.get(THEME_COOKIE_NAME)));

  if (event.url.pathname.startsWith(ThemeEndpoint.Set)) {
    const { theme } = await event.request.json() as { theme: Theme };
    setTheme(theme);

    return new Response(
      JSON.stringify({ theme }),
      {
        headers: {
          'Set-Cookie': event.cookies.serialize(
            THEME_COOKIE_NAME,
            theme,
            {
              path: '/',
              maxAge: time.years(5) / time.seconds(1),
            },
          ),
        },
      },
    );
  }

  const response = await resolve(
    event,
    {
      transformPageChunk: ({ html }) => {
        const agent = event.request.headers.get('user-agent');
        const currentTheme = getDeviceType(agent) === 'tv'
          ? Theme.Dark
          : event.locals.theme;

        const scope = 'none';

        return html
          .replace(THEME_PLACEHOLDER, `${currentTheme}`)
          .replace(THEME_SCOPE_PLACEHOLDER, `${scope}`);
      },
    },
  );

  return response;
};
