import { normalizeTranslationKey } from './normalizeTranslationKey.ts';

const SUBGENRE_MAP: Partial<Record<string, () => string>> = {};

// For now these don't have actual translations since we have 1k+ subgenres
export function toTranslatedSubgenre(subgenre: string): string {
  const translationFn = SUBGENRE_MAP[normalizeTranslationKey(subgenre)];
  return translationFn?.() ?? subgenre;
}
