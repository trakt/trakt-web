import type { AvailableLanguage } from '$lib/features/i18n/index.ts';

type DisplayNamesType = 'language' | 'region';

type ToDisplayNameProps = {
  code: string;
  languageTag: AvailableLanguage;
  type: DisplayNamesType;
};

export function toDisplayName({
  code,
  languageTag,
  type,
}: ToDisplayNameProps) {
  const displayNames = new Intl.DisplayNames(languageTag, { type });
  const displayName = displayNames.of(
    code.toUpperCase(),
  );

  return displayName ?? code;
}
