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

function sanitizeLocale(locale: string): AvailableLocale {
  return availableLocales.includes(locale as AvailableLocale)
    ? locale as AvailableLocale
    : defaultLocale;
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
    language === 'en' ? DEFAULT_REGION_EN : parts.at(1),
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
 *
 * For Arabic (`ar-SA`), forces Gregorian calendar (`ca-gregory`) and Latin
 * numerals (`nu-latn`).  The Trakt UI displays years, durations, and ratings
 * as Latin digits everywhere; without the `nu-latn` override, `Intl`
 * formatters would emit Eastern Arabic-Indic numerals (٠١٢…) which would
 * clash with the rest of the interface.  All other locales pass through
 * unchanged.
 */
export function getIntlLocale(
  locale: AvailableLocale | AvailableLanguage = languageTag(),
) {
  if (locale === 'ar-SA' || locale === 'ar' || locale.startsWith('ar-')) {
    return 'ar-SA-u-ca-gregory-nu-latn';
  }
  return locale;
}

export const setLocale = (locale: string): AvailableLocale => {
  const sanitizedLocale = sanitizeLocale(locale);

  _setLocale(sanitizedLocale, { reload: false });
  return sanitizedLocale;
};

const RTL_LOCALES = new Set<AvailableLocale>(['fa-IR', 'ar-SA']);

export const getTextDirection = (locale: AvailableLocale) =>
  RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';

export const getPreferredLocale = (headers: Headers): AvailableLocale => {
  const localeIdentifiers = availableLocales.map((locale) => {
    const { language, region } = splitLanguageTag(locale);
    return `${language}-${region}`;
  });

  const resolvedLocale = resolveAcceptLanguage(
    headers.get('Accept-Language') ?? '',
    localeIdentifiers,
    FALLBACK_LOCALE,
  );

  return sanitizeLocale(resolvedLocale);
};
