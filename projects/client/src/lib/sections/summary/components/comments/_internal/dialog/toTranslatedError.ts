import type { CommentError } from '$lib/sections/summary/components/comments/_internal/models/CommentError.ts';
import { toTranslatedValue } from '$lib/utils/formatting/string/toTranslatedValue.ts';

const ERROR_PREFIX = 'error_comment';

// FIXME: extract and add generic way to translate errors
export function toTranslatedError(error: CommentError) {
  return toTranslatedValue(ERROR_PREFIX, error);
}
