import { Theme } from './models/Theme.ts';
import type { RequestEvent } from '@sveltejs/kit';
import { coerceTheme } from '$lib/features/theme/utils/coerceTheme.ts';
import {
  THEME_COOKIE_NAME,
  THEME_FIELD_NAME,
} from '$lib/features/theme/constants.ts';

export type ThemeResponse = { theme: Theme };

const FIVE_YEARS_IN_SECONDS = 365 * 24 * 60 * 60;

export const action = async (
  { cookies, request }: RequestEvent,
): Promise<ThemeResponse> => {
  const data = await request.formData();
  const theme = coerceTheme(data.get(THEME_FIELD_NAME)?.toString());

  cookies.set(THEME_COOKIE_NAME, theme, {
    path: '/',
    maxAge: FIVE_YEARS_IN_SECONDS,
  });

  return { theme };
};
