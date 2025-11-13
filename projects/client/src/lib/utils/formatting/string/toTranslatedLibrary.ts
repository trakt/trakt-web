import * as m from '$lib/features/i18n/messages.ts';

const LIBRARY_MAP = {
  custom: m.translated_value_library_custom,
} as const;

export function toTranslatedLibrary(
  library: string | (keyof typeof LIBRARY_MAP),
  data?: Record<string, unknown>,
): string {
  const translationFn = LIBRARY_MAP[library as keyof typeof LIBRARY_MAP];
  return translationFn?.(data) ?? library;
}
