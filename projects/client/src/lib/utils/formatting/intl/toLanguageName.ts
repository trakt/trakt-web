import type { AvailableLanguage } from '$lib/features/i18n/index.ts';
import { toDisplayName } from '$lib/utils/formatting/intl/_internal/toDisplayName.ts';

export function toLanguageName(code: string, languageTag: AvailableLanguage) {
  return toDisplayName({
    code,
    languageTag,
    type: 'language',
  });
}
