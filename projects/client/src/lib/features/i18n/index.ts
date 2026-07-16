import type { Locale } from '$lib/paraglide/runtime.js';
import {
  baseLocale,
  getLocale as _getLocale,
  locales,
  setLocale as _setLocale,
} from '$lib/paraglide/runtime.js';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { resolveAcceptLanguage } from 'resolve-accept-language';

const DEFAULT_REGION_EN = 'us';
const FALLBACK_LOCALE = `en-${DEFAULT_REGION_EN}`;

type ExtractLanguage<T> = T extends `${infer Lang}-${string}` ? Lang : T;
type ExtractRegion<T> = T extends 'en' ? 'us'
  : T extends `${string}-${infer Region}` ? Region
  : T;

export type AvailableLocale = Locale;
export type AvailableLanguage = ExtractLanguage<AvailableLocale>;
export type AvailableRegion = ExtractRegion<AvailableLocale>;

export const availableLocales = locales;
export const defaultLocale = baseLocale;

/**
 * Maps the canonical BCP-47 form that `splitLanguageTag` produces back to the
 * `AvailableLocale` it came from.  For locales that are stored without a
 * region (e.g. `ar`), `splitLanguageTag` uses the language code as the region
 * fallback (e.g. `ar-ar`).  Without this map, `sanitizeLocale('ar-ar')` would
 * not find `ar` in `availableLocales` and would fall back to `en`.
 */
const canonicalLocaleMap = new Map<string, AvailableLocale>(
  locales.map((locale) => {
    const { language, region } = splitLanguageTagRaw(locale);
    return [`${language}-${region}`, locale];
  }),
);

function sanitizeLocale(locale: string): AvailableLocale {
  if (availableLocales.includes(locale as AvailableLocale)) {
    return locale as AvailableLocale;
  }
  // Try the canonical BCP-47 form in case e.g. `ar` was expanded to `ar-ar`
  const canonical = canonicalLocaleMap.get(locale.toLowerCase());
  return canonical ?? defaultLocale;
}

function splitLanguageTagRaw(tag: string): {
  language: string;
  region: string;
} {
  const parts = tag.split('-');
  const language = assertDefined(
    parts.at(0),
    'Language code is required.',
  );
  const region = parts.at(1) ?? language;
  return { language, region };
}

function splitLanguageTag(languageTag: Locale): {
  language: AvailableLanguage;
  region: AvailableRegion;
} {
  const parts = languageTag.split('-');

  const language = assertDefined(
    parts.at(0),
    'Language code is required.',
  ) as AvailableLanguage;
  const region = assertDefined(
    parts.at(1) ?? (language === 'en' ? DEFAULT_REGION_EN : language),
    'Region code is required.',
  ) as AvailableRegion;

  return {
    language,
    region,
  };
}

export function getLanguageAndRegion() {
  return splitLanguageTag(getLocale());
}

export function getLocale() {
  return _getLocale();
}

export function languageTag() {
  return getLanguageAndRegion().language;
}

/**
 * Returns a locale string suitable for `Intl.*` constructors.
 * For Arabic, forces Gregorian calendar and Latin numerals so that
 * numeric output (years, durations, ratings) stays in the Latin script
 * that the rest of the UI uses. All other locales pass through unchanged.
 */
export function getIntlLocale(
  locale: AvailableLocale | AvailableLanguage = languageTag(),
) {
  if (locale === 'ar' || locale.startsWith('ar-')) {
    return 'ar-u-ca-gregory-nu-latn';
  }
  return locale;
}

export const setLocale = (locale: string): AvailableLocale => {
  const sanitizedLocale = sanitizeLocale(locale);

  _setLocale(sanitizedLocale, { reload: false });
  return sanitizedLocale;
};

const RTL_LOCALES = new Set<AvailableLocale>(['fa-IR', 'ar']);

export const getTextDirection = (locale: AvailableLocale) =>
  RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';

export const getPreferredLocale = (headers: Headers): AvailableLocale => {
  const localeIdentifiers = availableLocales.map((locale) => {
    const { language, region } = splitLanguageTagRaw(locale);
    return `${language}-${region}`;
  });

  const resolvedLocale = resolveAcceptLanguage(
    headers.get('Accept-Language') ?? '',
    localeIdentifiers,
    FALLBACK_LOCALE,
  );

  return sanitizeLocale(resolvedLocale);
};
