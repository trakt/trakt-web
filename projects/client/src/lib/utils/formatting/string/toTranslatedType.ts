import * as m from '$lib/features/i18n/messages.ts';

const TYPE_MAP = {
  movie: m.translated_value_type_movie,
  show: m.translated_value_type_show,
} as const;

export function toTranslatedType(
  type: string | (keyof typeof TYPE_MAP),
  data?: Record<string, unknown>,
): string {
  const translationFn = TYPE_MAP[type as keyof typeof TYPE_MAP];
  return translationFn?.(data) ?? type;
}
