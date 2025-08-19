/**
 * Generate Android resource folder name based on locale and available locales
 * Uses language-only folder if it's the only locale for that language, otherwise uses region-specific format
 */

export function generateAndroidResourceFolder(
  locale: string,
  allLocales: string[],
): string {
  if (locale === 'en') {
    // Special case for English, always use values
    return 'values';
  }

  const normalizedLocale = locale.toLowerCase();

  // Extract language code (first part before hyphen)
  const languageCode = normalizedLocale.split('-')[0];

  // If it's already a language-only locale (e.g., 'en'), use values-{language}
  if (!normalizedLocale.includes('-')) {
    return `values-${normalizedLocale}`;
  }

  // Handle complex locales with more than 2 parts (e.g., zh-hans-cn)
  const parts = normalizedLocale.split('-');
  if (parts.length > 2) {
    // For complex locales, always use the full locale
    return `values-${normalizedLocale}`;
  }

  // Find all locales for this language (only consider simple language-region locales)
  const sameLanguageLocales = allLocales
    .map((l) => l.toLowerCase())
    .filter((l) => {
      const lParts = l.split('-');
      // Only consider locales with same language code and at most 2 parts
      return lParts[0] === languageCode && lParts.length <= 2;
    });

  // If there's only one simple locale for this language, use just the language code
  if (sameLanguageLocales.length === 1) {
    return `values-${languageCode}`;
  }

  // Otherwise use the specific region format (values-{language}-{REGION})
  if (parts.length === 2 && parts[1]) {
    const [language, region] = parts;
    return `values-${language}-${region.toUpperCase()}`;
  }

  // Fallback for edge cases
  return `values-${normalizedLocale}`;
}
