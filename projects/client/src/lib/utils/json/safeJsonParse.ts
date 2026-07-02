/**
 * Parses a JSON string, returning `fallback` when the value is absent
 * (null/undefined/empty string) or not valid JSON. Never throws - safe for
 * user-controlled input like cookies and request bodies.
 */
export function safeJsonParse<T>(value: string | Nil, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    // JSON.parse('null') returns null and skips the catch, so coalesce to
    // keep the fallback for callers expecting a non-nullable value.
    return (JSON.parse(value) ?? fallback) as T;
  } catch {
    return fallback;
  }
}
