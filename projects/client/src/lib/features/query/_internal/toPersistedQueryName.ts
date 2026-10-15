const UNKNOWN = 'unknown';

export function toPersistedQueryName(storageKey: string): string {
  const hashStart = storageKey.indexOf('[');
  if (hashStart === -1) return UNKNOWN;

  try {
    const queryKey: unknown = JSON.parse(storageKey.slice(hashStart));
    const name = Array.isArray(queryKey) ? queryKey.at(0) : undefined;

    return typeof name === 'string' ? name : UNKNOWN;
  } catch {
    return UNKNOWN;
  }
}
