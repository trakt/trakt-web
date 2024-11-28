import type { Locale } from 'date-fns/locale';
import { enUS, fr } from 'date-fns/locale';

export const LOCALE_MAP: Record<string, Locale> = {
  'en': enUS,
  'fr': fr,
} satisfies { 'en': Locale; [key: string]: Locale };
