import type { MetaMessages } from '../../i18n/generator/model/MetaMessages.ts';
import { I18N_META_DIR } from './constants.ts';
export type TranslationMap = Record<string, string>;

export async function loadMetaFile(locale: string): Promise<MetaMessages> {
  const filePath = `${I18N_META_DIR}/${locale}.json`;
  const content = await Deno.readTextFile(filePath);
  return JSON.parse(content);
}
