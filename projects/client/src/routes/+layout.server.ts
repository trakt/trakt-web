import { AUTH_COOKIE_NAME } from '$lib/features/auth/constants.ts';
import type { SerializedAuthResponse } from '$lib/features/auth/models/SerializedAuthResponse.ts';
import { THEME_COOKIE_NAME } from '$lib/features/theme/constants.ts';
import { coerceTheme } from '$lib/features/theme/utils/coerceTheme.ts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
  const theme = coerceTheme(cookies.get(THEME_COOKIE_NAME));
  const serializedToken = cookies.get(AUTH_COOKIE_NAME);

  if (!serializedToken) {
    return { theme };
  }

  try {
    const { token } = JSON.parse(serializedToken) as SerializedAuthResponse;
    return { theme, token: token.access };
  } catch (_err) {
    cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
    return { theme };
  }
};
