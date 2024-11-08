import { THEME_COOKIE_NAME } from '$lib/features/theme/constants.ts';
import { type ServerLoad } from '@sveltejs/kit';
import { coerceTheme } from '$lib/features/theme/utils/coerceTheme.ts';

export const load: ServerLoad = ({ cookies }) => {
  const theme = coerceTheme(cookies.get(THEME_COOKIE_NAME));

  return { theme };
};
