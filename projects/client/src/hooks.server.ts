import { handle as handleAuth } from '$lib/features/auth/handle.ts';
import { i18n } from '$lib/features/i18n/index.ts';
import { handle as handleTheme } from '$lib/features/theme/handle.ts';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleParaglide: Handle = i18n.handle();

export const handle: Handle = sequence(
  handleParaglide,
  handleTheme,
  handleAuth,
);
