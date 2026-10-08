import { normalizePhrase } from './_internal/normalizePhrase.ts';

const GAME_KEYWORD = 'game';

export function isGameKeyword(query: string | Nil): boolean {
  return normalizePhrase(query) === GAME_KEYWORD;
}
