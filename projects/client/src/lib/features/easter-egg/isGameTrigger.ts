const TRIGGER_PHRASE = 'i want to play a game';

export function isGameTrigger(query: string | Nil): boolean {
  const normalized = (query ?? '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized === TRIGGER_PHRASE;
}
