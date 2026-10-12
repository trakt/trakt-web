import { ThemeEndpoint } from '$lib/features/theme/ThemeEndpoint.ts';
import { THEME_COOKIE_NAME } from '$lib/features/theme/constants.ts';
import { renderSeasonalCover } from '$lib/features/theme/_internal/renderSeasonalCover.ts';
import { Theme } from '$lib/features/theme/models/Theme.ts';
import { coerceTheme } from '$lib/features/theme/utils/coerceTheme.ts';
import { safeJsonParse } from '$lib/utils/json/safeJsonParse.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { Handle } from '@sveltejs/kit';

export const THEME_PLACEHOLDER = '%theme.current%';
export const THEME_SCOPE_PLACEHOLDER = '%theme.seasonal%';
export const SEASONAL_COVER_PLACEHOLDER = '%theme.seasonal.cover%';

export type ThemeResponse = { theme: Theme };

export const handle: Handle = async ({ event, resolve }) => {
  const setTheme = (theme: Theme) => {
    event.locals.theme = theme;
  };

  setTheme(coerceTheme(event.cookies.get(THEME_COOKIE_NAME)));

  if (event.url.pathname.startsWith(ThemeEndpoint.Set)) {
    if (event.request.method !== 'POST') {
      return new Response(null, { status: 405, headers: { allow: 'POST' } });
    }

    const { theme } = safeJsonParse<Partial<ThemeResponse>>(
      await event.request.text(),
      {},
    );

    if (!theme) {
      return new Response(null, { status: 400 });
    }

    setTheme(theme);

    return new Response(JSON.stringify({ theme }), {
      headers: {
        'Set-Cookie': event.cookies.serialize(THEME_COOKIE_NAME, theme, {
          path: '/',
          maxAge: time.years(5) / time.seconds(1),
        }),
      },
    });
  }

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => {
      const theme = event.locals.theme;
      const scope = 'none';

      return html
        .replace(THEME_PLACEHOLDER, `${theme}`)
        .replace(THEME_SCOPE_PLACEHOLDER, `${scope}`)
        .replace(SEASONAL_COVER_PLACEHOLDER, renderSeasonalCover(new Date()));
    },
  });

  return response;
};
