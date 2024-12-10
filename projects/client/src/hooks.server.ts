import { handle as handleAuth } from '$lib/features/auth/handle.ts';
import { handle as handleLocale } from '$lib/features/i18n/handle.ts';
import { handle as handleImage } from '$lib/features/image/handle.ts';
import { handle as handleTheme } from '$lib/features/theme/handle.ts';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const WHITELISTED_HEADERS = new Set([
  'content-type',
  'x-pagination-page',
  'x-pagination-page-count',
]);

export const handle: Handle = sequence(
  handleLocale,
  handleTheme,
  handleAuth,
  handleImage,
  ({ event, resolve }) => {
    return resolve(event, {
      filterSerializedResponseHeaders: (name) => WHITELISTED_HEADERS.has(name),
    });
  },
);
