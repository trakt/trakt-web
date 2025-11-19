function normalizeString(input: string, separator: string): string {
  return input.replace(/[^a-zA-Z0-9]/g, separator).toLowerCase();
}

export function normalizeTranslationKey(key: string): string {
  return normalizeString(key, '_');
}
