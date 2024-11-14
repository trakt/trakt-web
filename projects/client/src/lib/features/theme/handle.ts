import { THEME_COOKIE_NAME } from '$lib/features/theme/constants.ts';
import { coerceTheme } from '$lib/features/theme/utils/coerceTheme.ts';
import type { Handle } from '@sveltejs/kit';

const THEME_PLACEHOLDER = '%theme.current%';

export const handle: Handle = async ({ event, resolve }) => {
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
