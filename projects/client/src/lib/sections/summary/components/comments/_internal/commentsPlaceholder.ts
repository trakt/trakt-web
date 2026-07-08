import { getLocale } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { COMMENT_LANGUAGE_ALL } from './commentLanguageAll.ts';

const DEFAULT_LANGUAGE = 'en';

/**
 * Localized display name for a language code. Falls back to the raw code for a
 * malformed tag, since the value can come straight from a URL search param and
 * `Intl.DisplayNames.of()` throws a RangeError on invalid BCP 47 input.
 */
function displayLanguageName(language: string): string {
  try {
    return new Intl.DisplayNames([getLocale()], { type: 'language' })
      .of(language) ?? language;
  } catch {
    return language;
  }
}

/**
 * Empty-state placeholder for comment lists. Uses the plain message for the
 * default filters ("all" / English), and a language-specific variant otherwise
 * (e.g. "No Dutch reviews yet."). `language` is the effective filter value
 * (nullish means "all").
 */
export function commentsPlaceholder(language: string | Nil): string {
  if (
    !language ||
    language === COMMENT_LANGUAGE_ALL ||
    language === DEFAULT_LANGUAGE
  ) {
    return m.list_placeholder_comments();
  }

  return m.list_placeholder_comments_language({
    language: displayLanguageName(language),
  });
}
