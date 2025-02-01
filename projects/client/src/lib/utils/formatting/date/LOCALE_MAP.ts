import type { Locale } from 'date-fns/locale';
import {
  de,
  enUS,
  es,
  fr,
  frCA,
  it,
  ja,
  nl,
  pl,
  ptBR,
  ro,
  uk,
} from 'date-fns/locale';

import type { AvailableLocale } from '$lib/features/i18n/index.ts';

export const LOCALE_MAP: Record<AvailableLocale, Locale> = {
  en: enUS,
  'fr-fr': fr,
  'fr-ca': frCA,
  'ja-jp': ja,
  'pt-br': ptBR,
  'es-es': es,
  'es-mx': es,
  'ro-ro': ro,
  'de-de': de,
  'nl-nl': nl,
  'uk-ua': uk,
  'pl-pl': pl,
  'it-it': it,
};
