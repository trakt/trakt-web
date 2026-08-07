import { availableLocales } from '$lib/features/i18n/index.ts';

export const commentLanguageCodes: ReadonlySet<string> = new Set(
  availableLocales.map((locale) => locale.split('-').at(0) ?? locale),
);
