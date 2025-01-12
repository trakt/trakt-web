import type { AvailableLanguageTag } from '$lib/paraglide/runtime.js';
import * as runtime from '$lib/paraglide/runtime.js';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';

const DEFAULT_REGION_EN = 'us';

export function getLanguageAndRegion(): {
  language: AvailableLanguage;
  region: AvailableRegion;
} {
  const parts = runtime.languageTag().split('-');

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

export function getLocale() {
  return runtime.languageTag();
}

export function languageTag() {
  return getLanguageAndRegion().language;
}

export type AvailableLocale = AvailableLanguageTag;

type ExtractLanguage<T> = T extends `${infer Lang}-${string}` ? Lang : T;
type ExtractRegion<T> = T extends 'en' ? 'us'
  : T extends `${string}-${infer Region}` ? Region
  : T;

export type AvailableLanguage = ExtractLanguage<AvailableLocale>;
export type AvailableRegion = ExtractRegion<AvailableLocale>;

export const isAvailableLocale = runtime.isAvailableLanguageTag;
export const availableLocales = runtime.availableLanguageTags;
export const defaultLocale = runtime.sourceLanguageTag;
export const setLocale = (locale: string): AvailableLocale => {
  const sanitizedLocale = availableLocales.includes(locale as AvailableLocale)
    ? locale as AvailableLocale
    : defaultLocale;

  runtime.setLanguageTag(sanitizedLocale);
  return sanitizedLocale;
};
export const getTextDirection = (_locale: AvailableLocale) => 'ltr';
export const onLanguageChange = runtime.onSetLanguageTag;
