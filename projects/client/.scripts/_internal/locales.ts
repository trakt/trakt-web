import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import config from '../../i18n/project.inlang/settings.json' with {
  type: 'json',
};

export const locales = config.locales as AvailableLocale[];
