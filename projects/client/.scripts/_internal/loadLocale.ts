import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { I18N_MESSAGES_DIR } from './constants.ts';
export type TranslationMap = Record<string, string>;

export async function loadLocale(
  locale: AvailableLocale,
): Promise<TranslationMap> {
  const path = `${I18N_MESSAGES_DIR}/${locale}.json`;
  try {
    const content = await Deno.readTextFile(path);
    return JSON.parse(content);
  } catch {
    return {};
  }
}
