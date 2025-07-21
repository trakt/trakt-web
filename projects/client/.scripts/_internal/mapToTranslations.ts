import type { MetaMessageDefinition } from '../../i18n/generator/model/MetaMessageDefinition.ts';
import type { TranslationMap } from './loadMetaFile.ts';

type MapToTranslationsType = {
  messages: Record<string, MetaMessageDefinition>;
  locales: string[];
  response: Array<Record<string, Record<string, string>>>;
};

export function mapToTranslations({
  messages,
  locales,
  response,
}: MapToTranslationsType) {
  // Since responses can contain multiple translation keys we aggregate them per locale
  const translations: Record<string, TranslationMap> = {};
  for (const locale of locales) {
    translations[locale] = {};
  }

  const addToTranslations = (
    locale: string,
    key: string,
    translation?: string,
  ) => {
    if (!translation) {
      return;
    }

    if (translations[locale]) {
      translations[locale][key] = translation;
      return;
    }

    translations[locale] = { [key]: translation };
  };

  response.forEach(
    (localeResponse: Record<string, TranslationMap>) => {
      for (const locale of locales) {
        const localeTranslations = localeResponse[locale];
        if (!localeTranslations) {
          console.warn(`⚠️ Missing translations for locale: ${locale}`);
          continue;
        }

        const translatedKeys = Object.keys(localeTranslations);
        for (const key of translatedKeys) {
          addToTranslations(locale, key, localeTranslations[key]);
        }
      }
    },
  );

  const expectedKeys = Object.keys(messages);
  for (const locale of locales) {
    const translatedKeys = Object.keys(translations[locale] ?? {});
    const missingKeys = expectedKeys.filter((key) =>
      !translatedKeys.includes(key)
    );

    if (missingKeys.length > 0) {
      console.warn(
        `⚠️ Missing ${missingKeys.length} keys for ${locale}: ${
          missingKeys.join(', ')
        }`,
      );
      // Fill missing keys with original values
      for (const key of missingKeys) {
        addToTranslations(locale, key, messages[key]?.default || '');
      }
    }
  }

  return translations;
}
