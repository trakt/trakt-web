import * as m from '$lib/features/i18n/messages.ts';

const ERROR_COMMENT_MAP = {
  invalid_content: m.translated_value_error_comment_invalid_content,
  unknown: m.translated_value_error_comment_unknown,
} as const;

export function toTranslatedErrorComment(
  error: string | (keyof typeof ERROR_COMMENT_MAP),
  data?: Record<string, unknown>,
): string {
  const translationFn =
    ERROR_COMMENT_MAP[error as keyof typeof ERROR_COMMENT_MAP];
  return translationFn?.(data) ?? error;
}
