import type { Handle } from '@sveltejs/kit';
import { i18n } from '$lib/features/i18n/index.ts';
const handleParaglide: Handle = i18n.handle();
export const handle: Handle = handleParaglide;
