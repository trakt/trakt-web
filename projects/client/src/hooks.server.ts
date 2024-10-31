import type { Handle } from '@sveltejs/kit';
import { i18n } from '$lib/features/i18n/index.ts';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as handleTheme } from '$lib/features/theme/handle.ts';
const handleParaglide: Handle = i18n.handle();

export const handle: Handle = sequence(
  handleParaglide,
  handleTheme,
);
