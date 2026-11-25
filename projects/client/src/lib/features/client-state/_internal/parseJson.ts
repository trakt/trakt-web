export function parseJson(raw: string | null): unknown {
  if (raw == null) return undefined;

  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}
