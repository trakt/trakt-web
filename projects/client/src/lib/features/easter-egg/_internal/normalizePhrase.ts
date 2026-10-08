export function normalizePhrase(value: string | Nil): string {
  return (value ?? '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}
