import { getLocale } from '$lib/features/i18n/index.ts';
import { toPosterLanguage } from './toPosterLanguage.ts';

export function posterLanguage() {
  return toPosterLanguage(getLocale());
}
